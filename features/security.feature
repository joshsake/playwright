Feature: Security

  Scenario: Page is served over HTTPS
    Given I navigate to the homepage
    Then the page URL should use HTTPS

  Scenario: Security headers are present
    Given I request the homepage
    Then the response should include a "content-security-policy" header
    And the response should include a "strict-transport-security" header
    And the response should include a "x-content-type-options" header

  Scenario: Page is not embeddable in iframes
    Given I request the homepage
    Then the response should protect against clickjacking

  Scenario: External links have tab-napping protection
    Given I navigate to the homepage
    Then all external links should have rel="noopener"

  Scenario: Cookies have security flags
    Given I navigate to the homepage
    Then all cookies should have the Secure flag
    And all cookies should have the SameSite attribute

  Scenario: Search input is XSS-resilient
    Given I am on the Playwright homepage
    When I open the search modal
    And I search for "<script>alert('xss')</script>"
    Then the script should not be executed
    And the page title should remain unchanged
