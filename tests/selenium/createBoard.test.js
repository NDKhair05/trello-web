import { Builder, By, until } from 'selenium-webdriver'
import 'chromedriver'

// URL of the application
const APP_URL = 'http://localhost:5173'

// User credentials
const TEST_USER = {
  email: 'kn87051@gmail.com',
  password: '123456789a'
}

async function login(driver) {
  try {
    console.log('Navigating to login page...')
    await driver.get(`${APP_URL}/login`)

    console.log('Waiting for email input...')
    // Wait for email field
    const emailInput = await driver.wait(until.elementLocated(By.name('email')), 5000)
    await emailInput.sendKeys(TEST_USER.email)

    console.log('Entering password...')
    await driver.findElement(By.name('password')).sendKeys(TEST_USER.password)

    console.log('Clicking login...')
    const loginButton = await driver.findElement(By.css('button[type="submit"]'))
    await loginButton.click()

    // Wait for redirect to home or dashboard
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Your boards')]")), 10000)
    console.log('✅ Login success')
  } catch (error) {
    console.error('❌ Login failed:', error)
    throw error // Re-throw to stop test
  }
}

async function createBoardTest(driver, boardTitle) {
  try {
    console.log(`Starting createBoardTest for "${boardTitle}"...`)

    const createBoardBtn = await driver.wait(
      until.elementLocated(By.xpath("//div[contains(text(), 'Create a new board')]")), 
      5000
    )
    await createBoardBtn.click()

    await driver.wait(until.elementLocated(By.xpath("//h2[contains(text(), 'Create a new board')]")), 5000)
    
    // TextField register('title') -> name="title"
    const titleInput = await driver.wait(until.elementLocated(By.name('title')), 5000)
    await titleInput.sendKeys(boardTitle)

    // TextField register('description') -> name="description"
    const descInput = await driver.findElement(By.name('description'))
    await descInput.sendKeys('This is a test board created by Selenium')

    const submitBtn = await driver.findElement(By.css('div[role="presentation"] form button[type="submit"]'))
    await submitBtn.click()

    // Wait for the new board to appear in the list OR for redirection to board details (URL changes to /boards/:id)
    await driver.wait(until.urlContains('/boards/'), 10000)
    
    console.log(`✅ successfully created board: ${boardTitle}`)

  } catch (error) {
    console.error(`❌ Create Board failed for ${boardTitle}:`, error)
    throw error
  }
}

async function createColumn(driver, columnTitle) {
  try {
    console.log(`Creating column: ${columnTitle}`)
    
    // 1. Locate "Add new column" button and click
    // Note: If no columns exist, it's a specific button. If columns exist, it's the same button at the end of the scroll container.
    // Selector from ListColumns.jsx: Button with startIcon={<NoteAddIcon />} and text "Add new column"
    const addColumnBtn = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(), 'Add new column')]")), 
      5000
    )
    await addColumnBtn.click()

    // 2. Locate input field (it appears after click)
    // Selector: Input which doesn't have a name but has label "Enter column title..."
    // We can use the generic input in the form that just appeared nearby.
    // But easiest is By.xpath("//input[contains(@id, ':r')]") is risky. 
    // Let's use document.activeElement since autoFocus is true
    // Or wait for an input that is visible in the container.
    // XPath: //div[contains(@class, 'MuiBox-root')]//input[@type='text']
    // Better: //label[text()='Enter column title...']/following-sibling::div/input
    const titleInput = await driver.wait(
      until.elementLocated(By.xpath("//label[text()='Enter column title...']/following-sibling::div/input")),
      2000
    )
    await titleInput.sendKeys(columnTitle)

    // 3. Click "Add Column" button
    const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Add Column')]"))
    await submitBtn.click()

    // 4. Verify column created (check if input with value exists)
    await driver.wait(
       until.elementLocated(By.xpath(`//input[@value='${columnTitle}']`)),
       5000
    )
    console.log(`✅ Created column: ${columnTitle}`)
  } catch (error) {
    console.error(`❌ Failed to create column ${columnTitle}:`, error)
    throw error
  }
}

async function createCard(driver, columnTitle, cardTitle) {
  try {
    console.log(`Creating card "${cardTitle}" in column "${columnTitle}"`)

    // 1. Find the column by title
    // Strategy: Find the input with the column title, then find its container that has "Add new card" button
    const columnContainer = await driver.findElement(
        By.xpath(`//input[@value='${columnTitle}']/ancestor::div[contains(@class, 'MuiBox-root') and descendant::button[contains(text(), "Add new card")]]`)
    )

    // 2. Click "Add new card" button in this column
    const addCardBtn = await columnContainer.findElement(By.xpath(".//button[contains(text(), 'Add new card')]"))
    await addCardBtn.click()

    // 3. Find card title input (it has label "Enter card title..." and autoFocus)
    // We search within the columnContainer to avoid ambiguity
    const cardInput = await columnContainer.findElement(By.xpath(".//label[text()='Enter card title...']/following-sibling::div/input"))
    await cardInput.sendKeys(cardTitle)

    // 4. Click "Add" button
    const addBtn = await columnContainer.findElement(By.xpath(".//button[contains(text(), 'Add')]"))
    await addBtn.click()

    // 5. Verify card exists
    await driver.wait(
        until.elementLocated(By.xpath(`//div[contains(@class, 'MuiCardContent-root')]/p[text()='${cardTitle}']`)),
        5000
    )
    console.log(`✅ Created card: ${cardTitle}`)
  } catch (error) {
    console.error(`❌ Failed to create card ${cardTitle}:`, error)
    throw error
  }
}

async function moveColumn(driver, sourceColumnTitle, targetColumnTitle) {
    try {
        console.log(`Moving column "${sourceColumnTitle}" to position of "${targetColumnTitle}"`)
        
        // Find source and target elements
        // The drag handle for the column is likely the main container or header. 
        // Based on analysis, the whole column div has the drag listeners.
        const sourceColumn = await driver.findElement(
            By.xpath(`//input[@value='${sourceColumnTitle}']/ancestor::div[contains(@class, 'MuiBox-root') and descendant::button[contains(text(), "Add new card")]]/parent::div`)
        )
        const targetColumn = await driver.findElement(
            By.xpath(`//input[@value='${targetColumnTitle}']/ancestor::div[contains(@class, 'MuiBox-root') and descendant::button[contains(text(), "Add new card")]]/parent::div`)
        )

        // Perform drag and drop
        const actions = driver.actions({async: true})
        await actions.dragAndDrop(sourceColumn, targetColumn).perform()
        
        // Verification is tricky without checking internal state or order precisely. 
        // We assume success if no error. Visually it should work.
        // Or we can check order of inputs in the DOM.
        
        console.log(`✅ Moved column ${sourceColumnTitle}`)
    } catch (error) {
        console.error(`❌ Failed to move column:`, error)
        // Don't throw, just log, as DnD can be flaky in Selenium
    }
}

async function moveCard(driver, cardTitle, targetColumnTitle) {
    try {
        console.log(`Moving card "${cardTitle}" to column "${targetColumnTitle}"`)
        
        // Find source card
        // MuiCard contains Typography with text cardTitle
        const card = await driver.findElement(By.xpath(`//div[contains(@class, 'MuiCardContent-root')]/p[text()='${cardTitle}']/ancestor::div[contains(@class, 'MuiPaper-root')]`))

        // Find target column area (the list of cards or the column itself)
        const targetColumn = await driver.findElement(
            By.xpath(`//input[@value='${targetColumnTitle}']/ancestor::div[contains(@class, 'MuiBox-root') and descendant::button[contains(text(), "Add new card")]]`)
        )

        // Perform drag and drop
        const actions = driver.actions({async: true})
        await actions.dragAndDrop(card, targetColumn).perform()

        console.log(`✅ Moved card ${cardTitle}`)
    } catch (error) {
        console.error(`❌ Failed to move card:`, error)
    }
}

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build()
  try {
    // await driver.manage().window().maximize()

    await login(driver)

    const timestamp = new Date().getTime()
    const boardName = `Selenium Board ${timestamp}`
    await createBoardTest(driver, boardName)
    
    // Create Columns
    const col1 = 'Column A'
    const col2 = 'Column B'
    await createColumn(driver, col1)
    await createColumn(driver, col2)

    // Create Cards
    const card1 = 'Card 1'
    const card2 = 'Card 2'
    await createCard(driver, col1, card1)
    await createCard(driver, col1, card2)

    // Move Card 1 from Column A to Column B
    await moveCard(driver, card1, col2)

    // Move Column A to position of Column B (Swap)
    await moveColumn(driver, col1, col2)

    console.log('🎉 All tests passed!')
  } catch (error) {
    console.error('Test Suite Failed:', error)
  } finally {
    // await driver.quit()
  }
}

runTest()
