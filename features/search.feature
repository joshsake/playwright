Feature: Search functionality

  Background:
    Given I am on the Playwright homepage

  Scenario: Open and close search modal
    When I open the search modal
    Then the search modal should be visible
    When I close the search modal
    Then the search modal should not be visible

  Scenario: Search returns results
    When I open the search modal
    And I search for "locator"
    Then I should see search results

  Scenario: Search with no results
    When I open the search modal
    And I search for "xyznonexistentterm123"
    Then I should see no results
