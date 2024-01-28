import {
	Component,
	OnDestroy,
	OnInit,
	AfterViewInit,
	ChangeDetectorRef,
} from '@angular/core'
import { EdamamRecipeService } from '../edamamRecipe.service'
import { DataStorageService } from '../../shared/data-storage.service'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'
import { EdamamRecipe } from '../edamamRecipe.model'
import { EdamamIngredient } from '../../shared/edamamDataModel/edamamIngredient.model'
import { animate, state, style, transition, trigger } from '@angular/animations'
import { EdamamTotalNutrient } from '../../shared/edamamDataModel/edamamTotalNutrients.model'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs

@Component({
	selector: 'edamam-recipe-detail',
	templateUrl: './edamam-recipe-detail.component.html',
	styleUrls: ['./edamam-recipe-detail.component.css'],
	animations: [
		trigger('detailExpand', [
			state('collapsed,void', style({ height: '0px', minHeight: '0' })),
			state('expanded', style({ height: '*' })),
			transition(
				'expanded <=> collapsed',
				animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
			),
		]),
	],
})
export class EdamamRecipeDetailComponent implements OnInit, OnDestroy {
	selectedEdamamRecipes: EdamamRecipe = null
	edamamRecipes = []
	subscription: Subscription
	recipeLabel: string
	displayedColumns: string[] = ['ingredient']

	dataSource: EdamamIngredient[] = []
	columnsToDisplay = ['text', 'weight', 'measure']
	columnsToDisplayWithExpandItems = [
		'image',
		'text',
		'quantity',
		'measure',
		'measure',
		'weight',
		'foodCategory',
	]
	columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand']
	expandedElement: EdamamIngredient[] | null

	selectedEdamamTotalNutrient: EdamamTotalNutrient
	// totalNutrientDataSource: EdamamTotalNutrient[] = [];
	totalNutrientDisplayedColumns: string[] = ['label', 'quantity']

	constructor(
		private route: ActivatedRoute,
		private dataStorageService: DataStorageService,
		private edamamRecipeService: EdamamRecipeService,
	) {}

	ngOnInit() {
		this.subscription = this.route.params.subscribe((params) => {
			this.recipeLabel = params.label.replace(/-/g, ' ')
			this.selectedEdamamRecipes =
				this.edamamRecipeService.getEdamamRecipeByLabel(this.recipeLabel)
			// console.log(`selectedEdamamRecipes: ${JSON.stringify(this.selectedEdamamRecipes)}`);
			this.dataSource = this.selectedEdamamRecipes.ingredients
			this.edamamRecipes = this.selectedEdamamRecipes.ingredients
			this.selectedEdamamTotalNutrient =
				this.selectedEdamamRecipes.totalNutrients
			console.log(
				`selectedEdamamTotalNutrient: ${JSON.stringify(
					this.selectedEdamamTotalNutrient,
				)}`,
			)
		})
	}

	generatePDF() {
		let docDefinition = {
			content: [
				{
					text: `${this.selectedEdamamRecipes.label} Recipe: `,
					style: 'header',
				},
				{ text: '\n', style: 'header' },
				...this.selectedEdamamRecipes.ingredients.map((ingredient) => ({
					stack: [
						{ text: `${ingredient.text}`, style: 'header' },
						{ text: `Quantity: ${ingredient.quantity}`, style: 'header' },
						{ text: `Measure: ${ingredient.measure}`, style: 'header' },
						{ text: `Weight: ${ingredient.weight}`, style: 'header' },
						{
							text: `Food Category: ${ingredient.foodCategory}`,
							style: 'header',
						},
						{ text: '\n', style: 'header' },
					],
				})),
				{ text: '\n\n', style: 'header' },
				{ text: 'Nutrition Facts', style: 'header' },
				{ text: '\n', style: 'header' },
				...Object.entries(this.selectedEdamamRecipes.totalNutrients).map(
					([key, value]) => ({
						text: `${key}. ${value.label}: ${parseFloat(value.quantity).toFixed(
							2,
						)} ${value.unit}`,
					}),
				),
			],
		}

		pdfMake.createPdf(docDefinition).open()
	}

	ngOnDestroy() {
		this.subscription.unsubscribe()
	}
}
