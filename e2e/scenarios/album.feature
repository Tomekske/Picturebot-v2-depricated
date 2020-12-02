Feature: Album testing
    Background: Run application
        Given Run application
    
    Scenario: Add a new album
        When I click on the add new album button
        Then I wait "2" seconds
        Then Close application