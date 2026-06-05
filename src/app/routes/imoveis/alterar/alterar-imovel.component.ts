import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { TipoImovelService } from '@core/services/tipo-imovel.service';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MtxPhotoviewerModule } from '@ng-matero/extensions/photoviewer';
import { MatGridListModule } from '@angular/material/grid-list';
import { ImovelService } from '../services/imovel.service';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoService } from '@core/services/estado.service';
import { MunicipioService } from '@core/services/municipio.service';
import { CepService } from '@core/services/cep.service';
import { ConfirmacaoExclusaoFotoImovelDialogComponent } from '../dialog/confirmacao-exclusao-foto-imovel-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ImagemImovelService } from '../services/imagem-imovel.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { TipoImovel } from '@core/models/tipo-imovel';
import { Estado } from '@core/models/estado';
import { Municipio } from '@core/models/municipio';
import { Cep } from '@core/models/cep';

@Component({
  selector: 'app-alterar-imovel',
  templateUrl: './alterar-imovel.component.html',
  styleUrls: ['./alterar-imovel.component.scss'],
  standalone: true,
  imports: [
    NgxMaskDirective,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
    MatSelectModule,
    CurrencyMaskModule,
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MtxPhotoviewerModule,
    MatGridListModule,
    MatStepperModule,
    TranslateModule
  ],
  providers: [
    TipoImovelService,
    EstadoService,
    provideNgxMask(),
    CepService,
    ImovelService,
    ImagemImovelService,
    MunicipioService
  ]
})
export class AlterarImovelComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tipoImovelService = inject(TipoImovelService);
  private readonly estadoService = inject(EstadoService);
  private readonly municipioService = inject(MunicipioService);
  private readonly cepService = inject(CepService);
  private readonly toastr = inject(HotToastService);
  private readonly imovelService = inject(ImovelService);
  private readonly imagemImovelService = inject(ImagemImovelService);
  private readonly translateService = inject(TranslateService);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly dialog = inject(MatDialog);

  tiposImovel: TipoImovel[] = [];
  estados: Estado[] = [];
  municipios: Municipio[] = [];
  idImovel: number = 0;
  // srcResult: any;
  arquivos: File[] = [];
  fotos: any[] = [];
  resultadoConsultaCep: Cep | undefined;
  imovelId: number | undefined;
  alterarImovelForm: FormGroup = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(200)]],
    tipoImovel: ['', [Validators.required]],
    estado: ['', []],
    municipio: ['', []],
    quartos: ['', []],
    suites: ['', []],
    valor: ['', [Validators.required]],
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
    aceitaFgts: [false],
    bairro: ['',[Validators.maxLength(200), Validators.required]],
    complemento: ['',[Validators.maxLength(200), Validators.required]],
    numero: ['',]
  });

  ngOnInit(): void {
    this.estadoService.listar().subscribe(estados => this.estados = estados);
    this.tipoImovelService.listar().subscribe(tiposImovel => this.tiposImovel = tiposImovel);
    this.imovelService.obterPor(this.route.snapshot.params['id']).subscribe(
      imovel => {
        this.idImovel = imovel.id;
        this.municipioService.listarPorSiglasEstados([imovel.municipio.estado.sigla]).subscribe(
          municipios => this.municipios = municipios
        );
        this.alterarImovelForm.setValue({
          nome: imovel.nome,
          tipoImovel: imovel.tipoImovel.id,
          estado: imovel.cep !== null ? '' : imovel.municipio.estado.sigla,
          municipio: imovel.cep ? '' : imovel.municipio.id,
          quartos: imovel.quartos,
          suites: imovel.suites,
          valor: imovel.valorVenda,
          areaPrivativa: imovel.areaPrivativa,
          areaTerreno: imovel.areaTerreno,
          cep: imovel.cep,
          cepDesconhecido: imovel.cep ? false : true,
          siglaEstado: imovel.cep ? imovel.municipio.estado.sigla : '',
          nomeMunicipio: imovel.cep ? imovel.municipio.nome : '',
          endereco: imovel.endereco,
          descricao: imovel.descricao,
          vagasGaragem: imovel.vagasGaragem,
          aceitaFinanciamento: imovel.aceitaFinanciamento,
          aceitaFgts: imovel.aceitaFgts,
          bairro: imovel.bairro,
          complemento: imovel.complemento,
          numero: imovel.numero
        });
        imovel.imagensImovel.forEach(
          imagem => {
            this.fotos.push({
              title: '',
              src: imagem.link,
              idImagemImovel: imagem.id
            })
          }
        )
      }
    );
    this.cep.valueChanges.subscribe(() => {
      const cep = this.cep.value.replace(/\D/g, "");
      if (cep.length > 7) {
        this.cepService.consultaCep(cep).subscribe(
          cep => {
            if (cep.erro === 'true') {
              this.toastr.warning('CEP não encontrado');
              this.resultadoConsultaCep = undefined;
            } else {
              this.siglaEstado.setValue(cep.uf);
              this.nomeMunicipio.setValue(cep.localidade);
              this.endereco.setValue(cep.logradouro);
              this.municipio.setValue(cep.ibge);
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
        this.resultadoConsultaCep = undefined;
      } else {
        this.cep.setValidators([Validators.required]);
        this.municipio.setValue('');
        this.estado.setValue('');
        this.estado.clearValidators();
        this.municipio.clearValidators();
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

  public alterar() {
    if (this.alterarImovelForm.valid) {
      this.imovelService.alterarImovel(this.idImovel, this.alterarImovelForm.getRawValue()).subscribe(
        resposta => {
          if (this.arquivos.length > 0) {
            const formData = new FormData();
            for (const arquivo of this.arquivos) {
              formData.append("arquivos", arquivo);
            }
            this.imovelService.uploadImagens(this.idImovel, formData).subscribe(
              () => {
                this.toastr.success('Operação realizada com sucesso');
                this.router.navigateByUrl('/imoveis');
              }
            )
          } else {
            this.translateService.get('success_operation').subscribe(
              mensagem => this.toastr.info(mensagem)
            );
            this.router.navigateByUrl('/imoveis');
          }
        }
      )
    }
  }

  public removerFoto(idImagemImovel: number, index: number) {
    const dialogRef = this.dialog.open(ConfirmacaoExclusaoFotoImovelDialogComponent, {
      data: {
        idImagemImovel: idImagemImovel
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result !== undefined) {
        if (result.idImagemImovel !== undefined) {
          this.imagemImovelService.excluirImagemImovel(result.idImagemImovel).subscribe(
            () => {
              this.fotos = this.fotos.filter(foto => foto.idImagemImovel !== result.idImagemImovel);
              this.translateService.get('success_operation').subscribe(
                mensagem => this.toastr.info(mensagem)
              );
            }
          );
        } else {
          this.arquivos.splice(index, 1);
          this.fotos.splice(index, 1);
        }
      }
    });
  }

  public get nome() {
    return this.alterarImovelForm.get('nome')!;
  }

  public get tipoImovel() {
    return this.alterarImovelForm.get('tipoImovel')!;
  }

  public get estado() {
    return this.alterarImovelForm.get('estado')!;
  }

  public get municipio() {
    return this.alterarImovelForm.get('municipio')!;
  }

  public get quartos() {
    return this.alterarImovelForm.get('quartos')!;
  }

  public get valor() {
    return this.alterarImovelForm.get('valor')!;
  }

  public get areaPrivativa() {
    return this.alterarImovelForm.get('areaPrivativa')!;
  }

  public get areaTerreno() {
    return this.alterarImovelForm.get('areaTerreno')!;
  }

  public get cep() {
    return this.alterarImovelForm.get('cep')!;
  }

  public get cepDesconhecido() {
    return this.alterarImovelForm.get('cepDesconhecido')!;
  }

  public get siglaEstado() {
    return this.alterarImovelForm.get('siglaEstado')!;
  }

  public get nomeMunicipio() {
    return this.alterarImovelForm.get('nomeMunicipio')!;
  }

  public get endereco() {
    return this.alterarImovelForm.get('endereco')!;
  }

  public get descricao() {
    return this.alterarImovelForm.get('descricao')!;
  }

  public get vagasGaragem() {
    return this.alterarImovelForm.get('vagasGaragem')!;
  }

  public get complemento() {
    return this.alterarImovelForm.get('complemento')!;
  }

  public get bairro() {
    return this.alterarImovelForm.get('bairro')!;
  }

  public get numero() {
    return this.alterarImovelForm.get('numero')!;
  }
}
