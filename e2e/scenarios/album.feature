Feature: Album tests
    Background: Run application
        Given I read settings file
        Then I cleanup workspace
        Then Run application

    Scenario: Add a new album
        When I click on the add new album button
        Then I wait "2" seconds
        Then Close application
