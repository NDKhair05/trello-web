import { test } from 'node:test'
import assert from 'node:assert/strict'
import { By, until } from 'selenium-webdriver'
import { configured, makeDriver, login, clickText } from './helpers.js'

test('create, edit and delete a board on the configured Supabase project', { skip: !configured }, async () => {
  const driver = await makeDriver()
  const title = `MVP test ${Date.now()}`
  try {
    await login(driver)
    await clickText(driver, 'Create a new board')
    await driver.wait(until.elementLocated(By.css('[role="dialog"] input')), 5000)
    await driver.findElement(By.css('[role="dialog"] input')).sendKeys(title)
    await driver.findElement(By.css('[role="dialog"] textarea')).sendKeys('Cloud coursework smoke test')
    await clickText(driver, 'Create')
    const link = await driver.wait(until.elementLocated(By.xpath(`//a[.//*[normalize-space(.)="${title}"]]`)), 15000)
    await link.click()
    await driver.wait(until.urlContains('/boards/'), 15000)
    await clickText(driver, 'Edit board')
    const input = await driver.wait(until.elementLocated(By.css('[role="dialog"] input')), 5000)
    await input.clear()
    await input.sendKeys(`${title} edited`)
    await clickText(driver, 'Save')
    await driver.wait(until.elementLocated(By.xpath(`//*[normalize-space(.)="${title} edited"]`)), 15000)
    await driver.navigate().refresh()
    await driver.wait(until.elementLocated(By.xpath(`//*[normalize-space(.)="${title} edited"]`)), 15000)
    await clickText(driver, 'Delete board')
    await clickText(driver, 'Ok')
    await driver.wait(until.urlMatches(/\/boards$/), 15000)
    assert.equal((await driver.findElements(By.xpath(`//*[normalize-space(.)="${title} edited"]`))).length, 0)
  } finally { await driver.quit() }
})
