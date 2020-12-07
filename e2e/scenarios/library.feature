Feature: Library testing
    Background: Run application
        Given Run application
    
    Scenario: Add a new library - invallid form input
        When I click on the add new library button
        Then I enter text "bla bla" within the library input
        Then I enter text "Hello there" within the name input
        Then I click on the save library button
        Then I wait "1" seconds
        Then I check wether the error snackbar is displayed
        Then I check wether the snackbar contains the text "Input values are invalid!"
        Then I check the base input for error messages
        Then I check the name input for error messages
        Then Close application
