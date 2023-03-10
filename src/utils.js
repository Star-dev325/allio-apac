import $ from 'jquery';

export const clarifyElementList = (source) => {
  let linkStack = [];
  const elements = $(source)
    .find('*')
    .get()
    .filter((element) => {
      if (element.tagName === 'A') {
        try {
          let urlObj = new URL(element.getAttribute('href'));
          if (linkStack.includes(element.getAttribute('href'))) return false;
          chrome.tabs.query({ active: true }, tabs => {
            const tabUrlObj = new URL(tabs[0].url);
            if (tabUrlObj.hostname === urlObj.hostname && urlObj.hash) return false;
            linkStack = [...linkStack, element.getAttribute('href')];
            return true;
          });
          return true;
        } catch (e) {
          console.log('url error:', e.message);
          return false;
        }
      }
      else return true;
    });
  return elements;
};