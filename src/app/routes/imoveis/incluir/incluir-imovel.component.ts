import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { TipoImovelService } from '@core/services/tipo-imovel.service';
import { MatSelectModule } from '@angular/material/select';
import { EstadoService } from '@core/services/estado.service';
import { MunicipioService } from '@core/services/municipio.service';
import { CommonModule } from '@angular/common';
import { CepService } from '@core/services/cep.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MtxPhotoviewerModule } from '@ng-matero/extensions/photoviewer';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImovelService } from '../services/imovel.service';
import { MatStepperModule } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { HotToastService } from '@ngxpert/hot-toast';
import { TipoImovel } from '@core/models/tipo-imovel';
import { Estado } from '@core/models/estado';
import { Municipio } from '@core/models/municipio';
import { Cep } from '@core/models/cep';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@Component({
  selector: 'app-incluir-imovel',
  templateUrl: './incluir-imovel.component.html',
  styleUrls: ['./incluir-imovel.component.scss'],
  standalone: true,
  imports: [
    NgxMaskDirective,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatSelectModule,
    CurrencyMaskModule,
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MtxPhotoviewerModule,
    MatGridListModule,
    MatStepperModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [TipoImovelService, EstadoService, provideNgxMask(), CepService, ImovelService]
})
export class IncluirImovelComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tipoImovelService = inject(TipoImovelService);
  private readonly estadoService = inject(EstadoService);
  private readonly municipioService = inject(MunicipioService);
  private readonly cepService = inject(CepService);
  private readonly toastr = inject(HotToastService);
  private readonly imovelService = inject(ImovelService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);

  tiposImovel: TipoImovel[] = [];
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  srcResult: any;
  arquivos: File[] = [];
  fotos: any[] = [];
  resultadoConsultaCep: Cep | undefined;

  incluirImovelForm = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(200)]],
    tipoImovel: ['', [Validators.required]],
    estado: ['', []],
    municipio: ['', []],
    quartos: ['', []],
    suites: ['', []],
    valor: [null, [Validators.required]],
    areaPrivativa: [null],
    areaTerreno: [null],
    cep: ['', [Validators.required]],
    cepDesconhecido: [false],
    siglaEstado: [''],
    nomeMunicipio: [''],
    endereco: ['', [Validators.required]],
    descricao: ['', [Validators.required]],
    vagasGaragem: [''],
    aceitaFinanciamento: [false],
    aceitaFgts:[false],
    complemento: ['',[Validators.maxLength(200), Validators.required]],
    bairro: ['',[Validators.maxLength(200), Validators.required]],
    numero: ['',]
  });

  ngOnInit(): void {
    this.tipoImovelService.listar().subscribe(tiposImovel => this.tiposImovel = tiposImovel);
    this.estadoService.listar().subscribe(estados => this.estados = estados);
    this.cep.valueChanges.subscribe(() => {
      const cep = this.cep.value.replace(/\D/g, "");
      if (cep.length > 7) {
        this.cepService.consultaCep(cep).subscribe(
          cep => {
            console.log(cep);
            if (cep.erro === 'true') {
              this.toastr.warning('CEP não encontrado');
              this.resultadoConsultaCep = undefined;
            } else {
              this.siglaEstado.setValue(cep.uf);
              this.nomeMunicipio.setValue(cep.localidade);
              this.endereco.setValue(cep.logradouro);
              this.municipio.setValue(cep.ibge);
              this.bairro.setValue(cep.bairro);
            }
          }
        )
      }
    });
    this.cepDesconhecido.valueChanges.subscribe(() => {
      if (this.cepDesconhecido.value) {
        this.cep.clearValidators();
        this.cep.setValue('');
        this.nomeMunicipio.setValue('');
        this.siglaEstado.setValue('');
        this.estado.setValidators([Validators.required]);
        this.municipio.setValidators([Validators.required]);
        this.complemento.setValidators([Validators.required]);
        this.bairro.setValidators([Validators.required]);
        this.resultadoConsultaCep = undefined;
      } else {
        this.cep.setValidators([Validators.required]);
        this.municipio.setValue('');
        this.estado.setValue('');
        this.estado.clearValidators();
        this.municipio.clearValidators();
        this.complemento.clearValidators();
        this.bairro.clearValidators();
      }
      this.cep.updateValueAndValidity();
      this.estado.updateValueAndValidity();
      this.municipio.updateValueAndValidity();
    });
    this.estado.valueChanges.subscribe(() => {
      if (this.estado.value) {
        this.municipioService.listarPorSiglasEstados([this.estado.value]).subscribe(
          municipios => this.municipios = municipios
        );
      }
    });
  }

  public onFileSelected(event: any) {
    let reader = new FileReader();
    const file: File = event.target.files[0];
    if (file) {
      this.arquivos.push(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fotos.push({
          title: 'Foto',
          src: reader.result,
          thumbnail: reader.result
        });
      };
    }
  }

  public cadastrar() {
    if (this.incluirImovelForm.valid) {
      this.imovelService.incluirImovel(this.incluirImovelForm.getRawValue()).subscribe(
        resposta => {
          const formData = new FormData();
          for (const arquivo of this.arquivos) {
            formData.append("arquivos", arquivo);
          }
          this.imovelService.uploadImagens(resposta.idImovel,formData).subscribe(
            () => {
              this.toastr.success('Imóvel cadastrado com sucesso');
              this.router.navigateByUrl('/imoveis');
            }
          )
        }
      )
    }
  }

  public removerFoto(index: number) {
    this.fotos.splice(index, 1);
    this.arquivos.splice(index, 1);
  }

  public get nome() {
    return this.incluirImovelForm.get('nome')!;
  }

  public get tipoImovel() {
    return this.incluirImovelForm.get('tipoImovel')!;
  }

  public get estado() {
    return this.incluirImovelForm.get('estado')!;
  }

  public get municipio() {
    return this.incluirImovelForm.get('municipio')!;
  }

  public get quartos() {
    return this.incluirImovelForm.get('quartos')!;
  }

  public get valor() {
    return this.incluirImovelForm.get('valor')!;
  }

  public get areaPrivativa() {
    return this.incluirImovelForm.get('areaPrivativa')!;
  }

  public get areaTerreno() {
    return this.incluirImovelForm.get('areaTerreno')!;
  }

  public get cep() {
    return this.incluirImovelForm.get('cep')!;
  }

  public get cepDesconhecido() {
    return this.incluirImovelForm.get('cepDesconhecido')!;
  }

  public get siglaEstado() {
    return this.incluirImovelForm.get('siglaEstado')!;
  }

  public get nomeMunicipio() {
    return this.incluirImovelForm.get('nomeMunicipio')!;
  }

  public get endereco() {
    return this.incluirImovelForm.get('endereco')!;
  }

  public get descricao() {
    return this.incluirImovelForm.get('descricao')!;
  }

  public get vagasGaragem() {
    return this.incluirImovelForm.get('vagasGaragem')!;
  }

  public get complemento() {
    return this.incluirImovelForm.get('complemento')!;
  }

  public get bairro() {
    return this.incluirImovelForm.get('bairro')!;
  }

  public get numero() {
    return this.incluirImovelForm.get('numero')!;
  }
}
