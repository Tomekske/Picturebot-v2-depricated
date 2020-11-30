Feature: Album testing
    Scenario: Add a new album
    Given Run application
    Given Application is loaded
    When I click on the add new album button
    Then Close application