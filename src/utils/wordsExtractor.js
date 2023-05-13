'use strict'
const natural = require('natural')
const pos = require('pos')

const tokenizer = new natural.WordTokenizer()
const stopWords = natural.stopwords
const tagger = new pos.Tagger()

exports.wordsExtractor = (inputString, types = []) => {
	const tokens = tokenizer.tokenize(inputString).filter((token) => {
		return !stopWords.includes(token)
	})
	const taggedTokens = tagger.tag(tokens)
	const words = taggedTokens.map(([token, tag]) => {
		if (types.some((type) => tag.startsWith(type))) return token
	})
	return words.filter((word) => word !== undefined)
}
