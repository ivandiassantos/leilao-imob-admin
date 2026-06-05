import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfiguracoesService } from './configuracoes.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { EstadoService } from '@core/services/estado.service';
import { MunicipioService } from '@core/services/municipio.service';
import { Estado } from '@core/models/estado';
import { Municipio } from '@core/models/municipio';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrl: './configuracoes.component.scss',
  standalone: true,
  imports: [
    MatCardModule, 
    TranslateModule,
    MatFormFieldModule, 
    FormsModule, 
    ReactiveFormsModule,
    MtxSelectModule,
    MtxButtonModule,
    MatButtonModule
  ],
  providers: [ConfiguracoesService]
})
export class ConfiguracoesComponent implements OnInit{

  private readonly fb = inject(FormBuilder);
  private readonly estadoService = inject(EstadoService);
  private readonly municipioService = inject(MunicipioService);
  private readonly configuracoesService = inject(ConfiguracoesService);
  private readonly toast = inject(HotToastService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  
  estados:Estado[]=[];
  municipios:Municipio[]=[];
  isSubmitting:boolean = false;

  configuracoesForm = this.fb.nonNullable.group({
    siglas: ['', [Validators.required]],
    municipiosSelecionados:['',[Validators.required]]
  });

  ngOnInit(): void {
    this.estadoService.listar().subscribe(
      estados => this.estados = estados
    )
  }

  public listarMunicipiosPorSiglasEstados(estadosSelecionados:Estado[]){
    const siglas = estadosSelecionados.map((estado => estado.sigla));
    this.municipioService.listarPorSiglasEstados(siglas).subscribe(
      municipios => this.municipios = municipios
    );
  }

  public salvar(){
    let idsMunicipios = new Array<number>();
    const municipios = this.municipiosSelecionados.value;
    for(let i = 0; i < municipios.length; i++){
      idsMunicipios.push(+municipios[i]);
    }
    this.configuracoesService.registrarMunicipiosInteresse(idsMunicipios).subscribe(
      response =>{
        this.translateService.get('success_operation').subscribe(
          message => {
            this.toast.info(message);
            this.router.navigateByUrl('/');
          }
        )
      }
    );
  }

  public get siglas(){
    return this.configuracoesForm.get('siglas')!;
  }

  public get municipiosSelecionados(){
    return this.configuracoesForm.get('municipiosSelecionados')!;
  }
}
