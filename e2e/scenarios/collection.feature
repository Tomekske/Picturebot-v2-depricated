Feature: Collection tests
    Background: Run application
        Given I read settings file
        Then I cleanup workspace
        Then Run application
        Then I click on the add new collection button

    Scenario: Add a new library - empty form input
        Then I click on the save collection button
        Then I wait "1" seconds
        Then I check whether the error snackbar is displayed
        Then I check whether the snackbar contains the text "Input values are invalid!"
        Then Collection page: I check whether the dropdown is disabled
        Then Collection page: I check the library selector for error messages "Please add a library"
        Then Collection page: I check the name input for error messages "Field is required" 
        Then Collection page: I check the base input for error messages "Field is required"
        Then Collection page: I check the preview input for error messages "Field is required"
        Then Collection page: I check the backup input for error messages "Field is required"
        Then Collection page: I check the files input for error messages "Field is required"
        Then Collection page: I check the favorites input for error messages "Field is required"
        Then Collection page: I check the edited input for error messages "Field is required"
        Then Collection page: I check the socialMedia input for error messages "Field is required"
        Then Close application
