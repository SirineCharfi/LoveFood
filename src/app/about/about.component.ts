import { Component, OnInit } from '@angular/core';
import { leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut,expand } from '../animations/app.animation';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),expand()//animation pour passer d'une page à une autre ou bien pour attendre que les informations se charge du backend
    ]
})
export class AboutComponent implements OnInit {
  leaders: leader[];
  constructor(private leaderService: LeaderService) { }

  ngOnInit() {
    
    this.leaderService.getLeader()
    .subscribe(leaders => this.leaders = leaders);//to get leaders service.methode spécifique
  }

}
