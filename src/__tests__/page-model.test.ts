import { Survey, SurveyGroupItem } from "../data_types";
import { SurveyEngineCore } from "../engine";


describe('testing max item per page', () => {
    const testSurvey: Survey = {
        current: {
            surveyDefinition: {
                key: "root",
                version: 0,
                items: [
                    { key: 'root.1', version: 1 },
                    { key: 'root.2', version: 1 },
                    { key: 'root.3', version: 1 },
                    { key: 'root.4', version: 1 },
                    { key: 'root.5', version: 1 },
                    { key: 'root.6', version: 1 },
                    { key: 'root.7', version: 1 },
                    { key: 'root.8', version: 1 },
                    { key: 'root.9', version: 1 },
                    { key: 'root.10', version: 1 },
                ],
            }
        },
        maxItemsPerPage: { large: 1, small: 1 },
    };


    test('max one item', () => {
        const surveyE = new SurveyEngineCore(
            testSurvey,
        );
        const pages = surveyE.getSurveyPages()
        expect(pages).toHaveLength(10);
        pages.forEach(page => {
            expect(page).toHaveLength(1);
        })
    })

    test('max four items', () => {
        testSurvey.maxItemsPerPage = { large: 4, small: 4 };
        const surveyE = new SurveyEngineCore(
            testSurvey,
        );
        const pages = surveyE.getSurveyPages()
        expect(pages).toHaveLength(3);
        pages.forEach(page => {
            expect(page.length == 4 || page.length == 2).toBeTruthy();
        })
    })

    test('different large and small setting', () => {
        testSurvey.maxItemsPerPage = { large: 4, small: 2 };
        const surveyE = new SurveyEngineCore(
            testSurvey,
        );
        const pagesL = surveyE.getSurveyPages('large')
        expect(pagesL).toHaveLength(3);
        const pagesS = surveyE.getSurveyPages('small')
        expect(pagesS).toHaveLength(5);
    })

    test('more than survey items present', () => {
        testSurvey.maxItemsPerPage = { large: 41, small: 22 };
        const surveyE = new SurveyEngineCore(
            testSurvey,
        );
        const pagesL = surveyE.getSurveyPages('large')
        expect(pagesL).toHaveLength(1);
        const pagesS = surveyE.getSurveyPages('small')
        expect(pagesS).toHaveLength(1);
    })
})

describe('testing pageBreak items', () => {
    test('test page break item after each other (empty page)', () => {
        const testSurvey: Survey = {
            current: {
                surveyDefinition: {
                    key: "root",
                    version: 0,
                    items: [
                        { key: 'root.1', version: 1, type: 'pageBreak' },
                        { key: 'root.2', version: 1, type: 'pageBreak' },
                        { key: 'root.3', version: 1, type: 'pageBreak' },
                        { key: 'root.4', version: 1, type: 'pageBreak' },
                        { key: 'root.5', version: 1, type: 'pageBreak' },
                        { key: 'root.6', version: 1, type: 'pageBreak' },
                        { key: 'root.7', version: 1, type: 'pageBreak' },
                        { key: 'root.8', version: 1, type: 'pageBreak' },
                        { key: 'root.9', version: 1, type: 'pageBreak' },
                        { key: 'root.10', version: 1, type: 'pageBreak' },
                    ],
                }
            }
        }

        const surveyE = new SurveyEngineCore(
            testSurvey,
        );
        const pages = surveyE.getSurveyPages()
        expect(pages).toHaveLength(0);

        expect(surveyE.getResponses()).toHaveLength(0);
    })

    test('test page break item typical usecase', () => {
        const testSurvey: Survey = {
            current: {
                surveyDefinition: {
                    key: "root",
                    version: 0,
                    items: [
                        { key: 'root.1', version: 1, follows: ['root'] },
                        { key: 'root.2', version: 1, follows: ['root.1'] },
                        { key: 'root.3', version: 1, follows: ['root.2'] },
                        { key: 'root.4', version: 1, follows: ['root.3'] },
                        { key: 'root.5', version: 1, follows: ['root.4'] },
                        { key: 'root.6', version: 1, follows: ['root.5'], type: 'pageBreak' },
                        { key: 'root.7', version: 1, follows: ['root.6'] },
                        { key: 'root.8', version: 1, follows: ['root.7'] },
                        { key: 'root.9', version: 1, type: 'pageBreak', follows: ['root.8'] },
                        { key: 'root.10', version: 1, follows: ['root.9'] },
                    ],
                }
            }
        }
        const surveyE = new SurveyEngineCore(
            testSurvey,
        );
        const pages = surveyE.getSurveyPages()
        expect(pages).toHaveLength(3);

        expect(surveyE.getResponses()).toHaveLength(8);
    })
})

describe('testing max item per page together with page break', () => {
    const surveyDef: SurveyGroupItem = {
        key: "root",
        version: 0,
        items: [
            { key: 'root.1', version: 1, follows: ['root'] },
            { key: 'root.2', version: 1, follows: ['root.1'] },
            { key: 'root.3', version: 1, follows: ['root.2'] },
            { key: 'root.4', version: 1, follows: ['root.3'] },
            { key: 'root.5', version: 1, follows: ['root.4'] },
            { key: 'root.6', version: 1, follows: ['root.5'], type: 'pageBreak' },
            { key: 'root.7', version: 1, follows: ['root.6'] },
            { key: 'root.8', version: 1, follows: ['root.7'] },
            { key: 'root.9', version: 1, type: 'pageBreak', follows: ['root.8'] },
            { key: 'root.10', version: 1, follows: ['root.9'] },
        ],
    };

    test('max one item per page together with pagebreaks', () => {
        const testSurvey: Survey = {
            current: {
                surveyDefinition: surveyDef,
            },
            maxItemsPerPage: { large: 1, small: 1 },
        }
        const surveyE = new SurveyEngineCore(
            testSurvey,
        );

        const pages = surveyE.getSurveyPages()
        expect(pages).toHaveLength(8);
        expect(surveyE.getResponses()).toHaveLength(8);
    })

    test('max four items per page together with pagebreak', () => {
        const testSurvey: Survey = {
            current: {
                surveyDefinition: surveyDef,
            },
            maxItemsPerPage: { large: 4, small: 4 },
        }
        const surveyE = new SurveyEngineCore(
            testSurvey,
        );

        const pages = surveyE.getSurveyPages()
        expect(pages).toHaveLength(4);
    })
})