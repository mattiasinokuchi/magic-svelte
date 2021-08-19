'use strict';

const assert = require('assert');

let webdriver = require('selenium-webdriver'),
  By = webdriver.By,
  until = webdriver.until;

describe('Heading', () => {
  it('should have the correct text content - Just a moment...', async function () {
    let driver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.firefox())
      .build();
    await driver.get('http://localhost:8888/');
    const header = await driver.findElement(By.css('h1'));
    const text = await header.getText();
    assert.strictEqual(text, 'Just a moment...');
    driver.quit();
  });
});
