class Menu():  
    '''Class to model the menu component'''

    def __init__(self, driver):
        '''Menu constructor
        
        Args:
            driver: Driver object
        '''

        self.driver = driver

    def click_add_album_item(self):
        '''Click on the add album button'''
        
        xpath = "/html/body/app-root/div/div[2]/div[1]/app-menu/div/ng-material-multilevel-menu/div/mat-list/ng-list-item[3]/mat-list-item/div/a/div"
        # selector = "#test-open-album-id"
        self.driver.click_by_xpath(xpath)
    
    def click_add_library_item(self):
        '''Click on the add library button'''

        xpath_collapse = "/html/body/app-root/div/div[2]/div[1]/app-menu/div/ng-material-multilevel-menu/div/mat-list/ng-list-item[1]/mat-list-item/div"
        xpath_add = "/html/body/app-root/div/div[2]/div[1]/app-menu/div/ng-material-multilevel-menu/div/mat-list/ng-list-item[1]/div/ng-list-item[2]/mat-list-item/div/a/div"
        
        # Open the menu before clicking on the add library item
        self.driver.click_by_xpath(xpath_collapse)
        # Click on the add library item
        self.driver.click_by_xpath(xpath_add)

    def click_add_collection_item(self):
        '''Click on the add collection button'''

        xpath_collapse = "/html/body/app-root/div/div[2]/div[1]/app-menu/div/ng-material-multilevel-menu/div/mat-list/ng-list-item[2]/mat-list-item/div/a/div[1]"
        xpath_add = "/html/body/app-root/div/div[2]/div[1]/app-menu/div/ng-material-multilevel-menu/div/mat-list/ng-list-item[2]/div/ng-list-item[2]/mat-list-item/div/a/div"
        
        # Open the menu before clicking on the add library item
        self.driver.click_by_xpath(xpath_collapse)
        # Click on the add library item
        self.driver.click_by_xpath(xpath_add)
