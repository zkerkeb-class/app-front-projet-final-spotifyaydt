import { soundex } from 'soundex-code';
import stringSimilarity from 'string-similarity';

// Phonetic matching for artists
export const phoneticMatch = (name, searchTerm) => {
  const namePhonetic = soundex(name);
  const searchPhonetic = soundex(searchTerm);
  return namePhonetic === searchPhonetic;
};

// Multiple keyword search
export const multiKeywordSearch = (text, keywords) => {
  const normalizedText = text.toLowerCase();
  return keywords.every((keyword) =>
    normalizedText.includes(keyword.toLowerCase())
  );
};

// Similarity search using Levenshtein distance
export const getSimilarity = (str1, str2) => {
  return stringSimilarity.compareTwoStrings(
    str1.toLowerCase(),
    str2.toLowerCase()
  );
};

// Process search query into keywords
export const processSearchQuery = (query) => {
  return query
    .toLowerCase()
    .split(' ')
    .filter((keyword) => keyword.length > 0);
};

// Intelligent search with all features
export const intelligentSearch = (items, query, options = {}) => {
  const {
    fields = ['name', 'title', 'artist'],
    similarityThreshold = 0.4,
    usePhonetic = true,
    maxResults = 20,
  } = options;

  const keywords = processSearchQuery(query);
  if (!keywords.length) return [];

  const results = items.map((item) => {
    let score = 0;
    let matches = 0;

    // Check each searchable field
    fields.forEach((field) => {
      if (!item[field]) return;

      const fieldValue = item[field].toLowerCase();

      // Exact match
      if (fieldValue.includes(query.toLowerCase())) {
        score += 1;
        matches++;
      }

      // Multiple keyword match
      if (multiKeywordSearch(fieldValue, keywords)) {
        score += 0.8;
        matches++;
      }

      // Phonetic match (for artist names)
      if ((usePhonetic && field === 'artist') || field === 'name') {
        if (phoneticMatch(fieldValue, query)) {
          score += 0.7;
          matches++;
        }
      }

      // Similarity match
      const similarity = getSimilarity(fieldValue, query);
      if (similarity > similarityThreshold) {
        score += similarity * 0.6;
        matches++;
      }
    });

    return {
      item,
      score: matches > 0 ? score / matches : 0,
    };
  });

  // Sort by score and return only items with matches
  return results
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map((result) => result.item);
};

// Autocomplete suggestions
export const getAutocompleteSuggestions = (items, query, options = {}) => {
  const {
    fields = ['name', 'title', 'artist'],
    maxSuggestions = 5,
    minQueryLength = 2,
  } = options;

  if (!query || query.length < minQueryLength) return [];

  const normalizedQuery = query.toLowerCase();
  const suggestions = new Set();

  items.forEach((item) => {
    fields.forEach((field) => {
      if (!item[field]) return;

      const fieldValue = item[field];
      if (fieldValue.toLowerCase().includes(normalizedQuery)) {
        // Add the matching part as a suggestion
        const words = fieldValue.split(' ');
        words.forEach((word) => {
          if (word.toLowerCase().includes(normalizedQuery)) {
            suggestions.add(word);
          }
        });
      }
    });
  });

  return Array.from(suggestions)
    .sort((a, b) => {
      // Prioritize suggestions that start with the query
      const aStartsWith = a.toLowerCase().startsWith(normalizedQuery);
      const bStartsWith = b.toLowerCase().startsWith(normalizedQuery);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.localeCompare(b);
    })
    .slice(0, maxSuggestions);
};
