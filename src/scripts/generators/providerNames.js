'use strict'
const { faker } = require('@faker-js/faker')

exports.generateProviderNames = () => {
	const count = 10
	const organizationSet = new Set()
	do {
		organizationSet.add(faker.helpers.arrayElement(options))
	} while (organizationSet.size !== count)
	return Array.from(organizationSet)
}

const options = [
	'MentorMe',
	'EduCare',
	'LearnCo',
	'EducationPlus',
	'FutureMinds',
	'MentorLink',
	'StudentSuccess',
	'EduMentor',
	'LearningBridge',
	'AcademyNow',
	'MentorMatch',
	'SmartStart',
	'EduQuest',
	'KnowledgeCore',
	'MentorMindset',
	'TeachForward',
	'EduPilot',
	'MentorNet',
	'InspireU',
]
