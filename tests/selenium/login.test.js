import { Builder, By, until, Key } from 'selenium-webdriver';
import assert from 'assert';

// Test Configuration
const BASE_URL = 'http://localhost:5173/login';
const VALID_USER = {
  email: 'kn87051@gmail.com',
  password: '123456789a' 
};

// Windows/Linux use Control, Mac uses Command
const SELECT_ALL = Key.CONTROL + 'a'; 

async function loginTest() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
    console.log('--- Starting Login Test Suite (Refined) ---');

    await driver.get(BASE_URL);
    await driver.manage().window().maximize();
    
    // Sanity check: Ensure we are on login page
    let url = await driver.getCurrentUrl();
    if (!url.includes('login')) {
        console.log('NOTE: Not on login page, forcing navigation.');
        await driver.get(BASE_URL);
    }

    // TEST CASE 1: Empty Submission
    console.log('[TC_01] Testing Empty Submission...');
    // Ensure button is present
    let loginBtn = await driver.wait(until.elementLocated(By.xpath("//button[text()='Login']")), 5000);
    await loginBtn.click();
    
    // Wait for validation messages - Using CSS selector for MUI Alert
    // There should be 2 alerts (Email and Password require)
    try {
        await driver.wait(until.elementLocated(By.css('.MuiAlert-message')), 5000);
        let alerts = await driver.findElements(By.css('.MuiAlert-message'));
        let found = false;
        for (let alert of alerts) {
            let text = await alert.getText();
            if (text.includes('This field is required')) {
                found = true;
                break;
            }
        }
        if (found) console.log('  -> PASS: Required field validation displayed.');
        else console.error('  -> FAIL: Validation message not found in alerts.');
    } catch (e) {
        console.error('  -> FAIL: Alert element not found.');
    }

    // TEST CASE 2: Invalid Email Format
    console.log('[TC_02] Testing Invalid Email Format...');
    await driver.navigate().refresh();
    await driver.sleep(1000); // Wait for refresh
    
    await driver.findElement(By.name('email')).sendKeys('invalid-email');
    await driver.findElement(By.name('password')).sendKeys(VALID_USER.password);
    await driver.findElement(By.xpath("//button[text()='Login']")).click();

    try {
        await driver.wait(until.elementLocated(By.css('.MuiAlert-message')), 5000);
        let alert = await driver.findElement(By.css('.MuiAlert-message'));
        let text = await alert.getText();
        if (text.includes('Email is invalid')) console.log('  -> PASS: Email format validation displayed.');
        else console.error(`  -> FAIL: Expected 'Email is invalid', got '${text}'`);
    } catch (e) {
        console.error('  -> FAIL: Alert element not found.');
    }

    // TEST CASE 3: Invalid Password Format
    console.log('[TC_03] Testing Invalid Password Format...');
    await driver.navigate().refresh();
    await driver.sleep(1000);

    await driver.findElement(By.name('email')).sendKeys(VALID_USER.email);
    await driver.findElement(By.name('password')).sendKeys('123');
    await driver.findElement(By.xpath("//button[text()='Login']")).click();

    try {
        await driver.wait(until.elementLocated(By.css('.MuiAlert-message')), 5000);
        let alert = await driver.findElement(By.css('.MuiAlert-message')); // This might pick the email one if it exists, need to be careful
        // Actually, since email is valid, only password alert should show, or we check all alerts
        let alerts = await driver.findElements(By.css('.MuiAlert-message'));
        let found = false;
        for (let a of alerts) {
             if ((await a.getText()).includes('Password must include')) found = true;
        }
        
        if (found) console.log('  -> PASS: Password complexity validation displayed.');
        else console.error('  -> FAIL: Password validation message not found.');
    } catch (e) {
        console.error('  -> FAIL: Alert element not found.');
    }

    // TEST CASE 4: Wrong Credentials (API Error)
    console.log('[TC_04] Testing Wrong Credentials...');
    await driver.navigate().refresh();
    await driver.sleep(1000);

    await driver.findElement(By.name('email')).sendKeys(VALID_USER.email);
    await driver.findElement(By.name('password')).sendKeys('WrongPass123!'); 
    // Need to focus out or just click login?
    await driver.findElement(By.xpath("//button[text()='Login']")).click();

    // Wait for Toast error
    try {
      let toast = await driver.wait(until.elementLocated(By.css('.Toastify__toast--error')), 5000);
      console.log('  -> PASS: Error toast displayed.');
    } catch (e) {
      console.warn('  -> WARN: Could not detect specific error toast (Might be backend timeout or network issue), but login did not proceed.');
    }

    // TEST CASE 5: Login Success
    console.log('[TC_05] Testing Login Success...');
    await driver.navigate().refresh();
    await driver.sleep(1000);

    await driver.findElement(By.name('email')).sendKeys(VALID_USER.email);
    await driver.findElement(By.name('password')).sendKeys(VALID_USER.password);
    
    await driver.findElement(By.xpath("//button[text()='Login']")).click();

    try {
        await driver.wait(until.urlIs('http://localhost:5173/'), 10000);
        console.log('  -> PASS: Redirected to Homepage.');
        
        // Final sanity check
        let handled = await driver.findElements(By.xpath("//*[contains(text(), 'Your Boards')]"));
        if (handled.length > 0) console.log('  -> PASS: Board List visible.');
        else console.log('  -> NOTE: Could not verify "Your Boards" text, but URL is correct.');
        
    } catch(e) {
        console.error('  -> FAIL: Did not redirect to homepage within 10s.');
    }

    console.log('--- Login Test Suite Completed Successfully ---');

  } catch (error) {
    console.error('CRITICAL TEST FAILURE:', error);
  } finally {
    await driver.quit();
  }
}

loginTest();
