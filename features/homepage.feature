Feature: Playwright.dev Homepage

  Background:
    Given I am on the Playwright homepage

  Scenario: Hero section is visible
    Then I should see the hero title
    And I should see the "Get started" button

  Scenario: Navigate to docs via Get Started button
    When I click the "Get started" button
    Then I should be on a docs page

  Scenario: Footer is present
    Then I should see footer links
