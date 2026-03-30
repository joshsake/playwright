Feature: Accessibility compliance

  Scenario: Homepage has no critical accessibility violations
    Given I am on the Playwright homepage
    Then the page should have no critical accessibility violations

  Scenario: Docs page has no critical accessibility violations
    Given I navigate to "/docs/intro"
    Then the page should have no critical accessibility violations

  Scenario: Search modal has no critical accessibility violations
    Given I am on the Playwright homepage
    When I open the search modal
    Then the page should have no critical accessibility violations

  Scenario: Homepage navigation is keyboard accessible
    Given I am on the Playwright homepage
    Then the main navigation should be reachable by keyboard

  Scenario: Images have alt text
    Given I am on the Playwright homepage
    Then all images should have alt attributes

  Scenario: Page has a single h1 heading
    Given I am on the Playwright homepage
    Then there should be exactly one h1 heading on the page
