import { ContentBody } from '../ContentBody';

describe('ContentBody', () => {
  it('test', () => {
    const props = {
      translations: {},
      questionData: {},
      userInfo: {},
    };

    expect(ContentBody(props)).toMatchSnapshot();
  });
});
