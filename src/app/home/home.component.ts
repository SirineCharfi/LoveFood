import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut,expand } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),expand()
    ]
})
export class HomeComponent implements OnInit {
dishErrMess:string;
leaderErrMess:string;
promotionErrMess:string;
  dish: Dish;
  promotion: Promotion;
leader: leader;
  constructor( @Inject('BaseURL') private BaseURl ,
    private dishservice: DishService, private leaderservice: LeaderService,
    private promotionservice: PromotionService) { }

  ngOnInit() {
    //appel aux methodes convenables to get dish/ promtion/ leader
    this.dishservice.getFeaturedDish()
    .subscribe(dish=> this.dish = dish,
      errmess => this.dishErrMess = <any>errmess);
    this.promotionservice.getFeaturedPromotion()
    .subscribe(promotion => this.promotion= promotion,
      errmess => this.promotionErrMess = <any>errmess);
    
     this.leaderservice.getFeaturedleader()
     .subscribe(leader=> this.leader = leader,
      errmess => this.leaderErrMess = <any>errmess);
    
  }
  

}
