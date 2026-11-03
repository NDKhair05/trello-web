import { Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'

export const appUrl = process.env.TEST_APP_URL || 'http://localhost:5173'
export const configured = Boolean(process.env.TEST_EMAIL && process.env.TEST_PASSWORD)
export const makeDriver = () => new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().addArguments('--headless=new', '--window-size=1440,1000')).build()
export const login = async driver => {
  await driver.get(`${appUrl}/login`)
  await driver.wait(until.elementLocated(By.name('email')), 15000)
  await driver.findElement(By.name('email')).sendKeys(process.env.TEST_EMAIL)
  await driver.findElement(By.name('password')).sendKeys(process.env.TEST_PASSWORD)
  await driver.findElement(By.css('button[type="submit"]')).click()
  await driver.wait(until.urlContains('/boards'), 15000)
}
export const clickText = async (driver, text) => {
  const element = await driver.wait(until.elementLocated(By.xpath(`//button[normalize-space(.)="${text}"]`)), 15000)
  await driver.wait(until.elementIsVisible(element), 5000)
  await element.click()
}
