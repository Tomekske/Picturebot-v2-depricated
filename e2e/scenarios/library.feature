Feature: Library tests
    Background: Run application
        Given I read settings file
        Then I cleanup workspace
        Then Run application
        Then I click on the add new library button

    Scenario: Add a new library - vallid form input
        Then I enter text "D:\e2e" within the library input
        Then I enter text "bdd" within the name input
        Then I click on the save library button
        Then I wait "1" seconds
        Then I check wether the error snackbar is displayed
        Then I check wether the snackbar contains the text "Library saved!"
        Then I check wether the library "D:\e2e\bdd" is saved in the database
        Then Close application

    Scenario: Add a new library - invallid form input
        Then I enter text "bla bla" within the library input
        Then I enter text "Hello there" within the name input
        Then I click on the save library button
        Then I wait "1" seconds
        Then I check wether the error snackbar is displayed
        Then I check wether the snackbar contains the text "Input values are invalid!"
        Then Library page: I check the base input for error messages "Directory is incorrect"
        Then Library page: I check the name input for error messages "Field is not allowed to contain white spaces"
        Then Close application

    Scenario: Add a new library - empty form input
        Then I click on the save library button
        Then I wait "1" seconds
        Then I check wether the error snackbar is displayed
        Then I check wether the snackbar contains the text "Input values are invalid!"
        Then Library page: I check the base input for error messages "Field is required"
        Then Library page: I check the name input for error messages "Field is required"
        Then Close application
