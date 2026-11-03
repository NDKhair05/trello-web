import { test } from 'node:test'
import assert from 'node:assert/strict'
import { By, until } from 'selenium-webdriver'
import { appUrl, configured, makeDriver, login } from './helpers.js'

test('login restores a Supabase session after reload and logout clears it', { skip: !configured }, async () => {
  const driver = await makeDriver()
  try {
    await login(driver)
    await driver.navigate().refresh()
    await driver.wait(until.elementLocated(By.xpath('//*[text()="Your boards"]')), 15000)
    assert.match(await driver.getCurrentUrl(), /\/boards/)
    await driver.findElement(By.css('button[aria-label="Account menu"]')).click()
    await driver.findElement(By.xpath('//*[@role="menuitem" and normalize-space(.)="Logout"]')).click()
    await driver.wait(until.urlContains('/login'), 15000)
    await driver.get(`${appUrl}/boards`)
    await driver.wait(until.elementLocated(By.name('email')), 15000)
  } finally { await driver.quit() }
})
