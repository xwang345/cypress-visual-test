import { Component, OnDestroy, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private userSub: Subscription;

    constructor(private dataStorageService: DataStorageService, private authorService: AuthService) {}

    ngOnInit() {
        this.userSub = this.authorService.user.subscribe(user => {
            this.isAuthenticated = !!user; // !! converts user to boolean
            console.log(!user);
            console.log(!!user);
        });
    }

    onSaveData() {
        this.dataStorageService.storeRecipes();
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
    }

    onLogout() {
        this.authorService.logout();
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}