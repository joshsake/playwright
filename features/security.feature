Feature: Security

  Scenario: Page is served over HTTPS
    Given I navigate to the homepage
    Then the page URL should use HTTPS

  # playwright.dev is served by GitHub Pages, which sends HSTS but no
  # content-security-policy or x-content-type-options headers.
  Scenario: HSTS security header is present
    Given I request the homepage
    Then the response should include a "strict-transport-security" header

  # GitHub Pages currently sends neither x-frame-options nor a CSP
  # frame-ancestors directive; re-enable if the site adds either.
  @fixme
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
