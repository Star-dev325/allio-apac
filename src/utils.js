import $ from 'jquery';

export const clarifyElementList = async (source) => {
  let linkStack = [];
  let elements = $(source).find('*').get();
  const tabs = await chrome.tabs.query({ active: true });
  const tabUrlObj = new URL(tabs[0].url);
  return elements.filter((element) => {
    let flag = true;
    if (element.tagName === 'A') {
      try {
        const urlObj = new URL(element.getAttribute('href'));
        if (linkStack.includes(urlObj.href) || (tabUrlObj.hostname === urlObj.hostname && urlObj.hash)) flag = false;
        else linkStack = [...linkStack, element.getAttribute('href')];
      } catch (e) {
        console.log(e.message, `url error with ${element.getAttribute('href')}`)
        flag = false;
      }
    }
    return flag;
  });
};