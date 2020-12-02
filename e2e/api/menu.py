
class Menu():
    def __init__(self, driver):
        self.driver = driver

    def click_add_album_item(self):
        xpath = "/html/body/app-root/div/div[2]/div[1]/app-menu/div/ng-material-multilevel-menu/div/mat-list/ng-list-item[3]/mat-list-item/div/a/div"
        # selector = "#test-open-album-id"
        self.driver.click_by_xpath(xpath)
        print("CLICCCCKED")
    
    def click_add_library_item(self):
        xpath_collapse = "/html/body/app-root/div/div[2]/div[1]/app-menu/div/ng-material-multilevel-menu/div/mat-list/ng-list-item[1]/mat-list-item/div"
        xpath_add = "/html/body/app-root/div/div[2]/div[1]/app-menu/div/ng-material-multilevel-menu/div/mat-list/ng-list-item[1]/div/ng-list-item[2]/mat-list-item/div/a/div"
        
        self.driver.click_by_xpath(xpath_collapse)
        self.driver.click_by_xpath(xpath_add)
