Feature: Library testing
    Background: Run application
        Given Run application
    
    Scenario: Add a new library
        When I click on the add new library button
        Then I enter text "bla bla" within the library input
        Then I enter text "Hello there" within the name input
        Then I wait "2" seconds
        Then Close application