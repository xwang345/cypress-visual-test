import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component'
import { ShoppingListComponent } from './shopping-list.component'
import { FormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { LoggingService } from '../logging.service'

@NgModule({
	declarations: [ShoppingListComponent, ShoppingEditComponent],
	imports: [
		FormsModule,
		RouterModule.forChild([{ path: '', component: ShoppingListComponent }]),
		SharedModule,
		MatInputModule,
		MatFormFieldModule,
	],
	providers: [LoggingService],
})
export class ShoppingListModule {}
