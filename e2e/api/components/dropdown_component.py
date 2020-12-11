class Dropdown():  
    '''Class to model the dropdown component'''

    def __init__(self, driver, id):
        '''Dropdown constructor
        
        Args:
            driver: Driver object
            id: Id of the error message component
        '''

        self.driver = driver
        self.id = id

    def is_visible(self):
        '''Check whether the dropdown is visible'''

        return self.driver.is_element_visible_by_id(self.id)

    def is_disabled(self):
        '''Check whether the dropdown is disabled'''

        return self.driver.is_element_disabled_by_id(self.id)

    def select_item(self, item):
        '''Select an item within the dropdown
        
        Args:
            driver: Driver object
            item: Selected item
        '''

        xpath = f'//mat-option/span[text()="{item}"]'

        # Open the dropdown before selecting the item
        self.driver.click_by_id(self.id)
        self.driver.click_by_xpath(xpath)
