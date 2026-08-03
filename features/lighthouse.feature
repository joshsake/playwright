@lighthouse
Feature: Lighthouse audits

  Scenario: Homepage meets best practices threshold
    Given I run a Lighthouse audit on the homepage
    Then the "best-practices" score should be at least 80

  Scenario: Homepage meets SEO threshold
    Given I run a Lighthouse audit on the homepage
    Then the "seo" score should be at least 90

  Scenario: Homepage meets performance threshold
    Given I run a Lighthouse audit on the homepage
    Then the "performance" score should be at least 50
