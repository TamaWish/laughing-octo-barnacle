from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # It's a mobile app, so let's use a mobile viewport
    page.set_viewport_size({"width": 375, "height": 812})

    # The expo dev server for web runs on a different port
    page.goto("http://localhost:8081")

    # Wait for the landing screen to appear by checking for its title
    expect(page.get_by_text("Welcome to SimsLyfe")).to_be_visible(timeout=60000)

    # Now click "New Game"
    page.get_by_role("button", name="New Game").click()

    # Now we should be on the home screen. Fill in the character details
    page.get_by_label("First Name").fill("Jules")
    page.get_by_label("Last Name").fill("Verne")
    page.get_by_role("button", name="Select Gender").click()
    page.get_by_role("button", name="Male").click()
    page.get_by_role("button", name="Select Country").click()
    page.get_by_role("button", name="United States").click()
    page.get_by_role("button", name="Start Life").click()

    # Navigate to Career screen and take screenshot
    page.get_by_text("Career", exact=True).click()
    page.wait_for_timeout(500) # Wait for screen transition
    page.screenshot(path="jules-scratch/verification/career-screen.png")

    # Navigate to Relationships screen and take screenshot
    page.get_by_text("Relationships", exact=True).click()
    page.wait_for_timeout(500) # Wait for screen transition
    page.screenshot(path="jules-scratch/verification/relationships-screen.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)