Feature: Hotel Search

  Scenario: List all hotels in Mumbai for the current date

    Given User launches the hotel booking application
    When User searches hotels in "Mumbai"
    And User clicks on Search
    Then All available hotel names should be displayed in the console