from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Start a new game
    page.goto("http://localhost:8081")

    # Wait for the button to be visible before clicking
    start_button = page.get_by_role("button", name="Start New Life")
    expect(start_button).to_be_visible(timeout=60000)
    start_button.click()

    # Wait for the game screen to load
    expect(page.get_by_text("Stats")).to_be_visible(timeout=60000)

    # Take a screenshot of the stats card
    stats_card = page.locator(".statsCard")
    expect(stats_card).to_be_visible(timeout=60000)
    stats_card.screenshot(path="jules-scratch/verification/fame-stat-verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)