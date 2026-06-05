import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlterarSenhaPrimeiroAcessoService } from './alterar-senha-primeiro-acesso.service';
import { Router } from '@angular/router';
import { AuthService, TokenService } from '@core';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-alterar-senha-primeiro-acesso',
  templateUrl: './alterar-senha-primeiro-acesso.component.html',
  standalone: true,
  imports: [
    TranslateModule,
    MtxButtonModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  providers:[
    AlterarSenhaPrimeiroAcessoService
  ]
})
export class AlterarSenhaPrimeiroAcessoComponent {

  fb = inject(FormBuilder);
  translateService = inject(TranslateService);
  toastr = inject(HotToastService);
  alterarSenhaPrimeiroAcessoService = inject(AlterarSenhaPrimeiroAcessoService);
  private readonly router = inject(Router);
  tokenService = inject(TokenService);
  private readonly authService = inject(AuthService);

  isSubmitting: boolean = false;

  alterarSenhaPrimeiroAcessoForm = this.fb.nonNullable.group({
    senhaAtual: ['', [Validators.required]],
    novaSenha: ['', [Validators.required]],
    confirmacaoNovaSenha: ['', [Validators.required]]
  });

  public alterar() {
    if (this.alterarSenhaPrimeiroAcessoForm.valid) {
      if (this.senhaAtual.value === this.novaSenha.value) {
        this.translateService.get('senha_atual_igual_nova').subscribe(
          mensagem => {
            this.toastr.error(mensagem);
            return false;
          }
        );
      }
      else if (this.novaSenha.value !== this.confirmacaoNovaSenha.value) {
        this.translateService.get('nova_senha_diferente_confirmacao').subscribe(
          mensagem => {
            this.toastr.error(mensagem);
            return false;
          }
        );
      }else{
        this.alterarSenhaPrimeiroAcessoService.alterar(this.alterarSenhaPrimeiroAcessoForm.value).subscribe(
          response => {
            this.translateService.get('sucesso_alteracao_senha_primeiro_acesso').subscribe(
              mensagem =>{
                this.toastr.success(mensagem);
                this.authService.logout().subscribe(
                  ()=>{
                    this.router.navigateByUrl('/auth/login');
                  }    
                );
              }
            )
          }
        );
      }
    }
  }

  public get senhaAtual() {
    return this.alterarSenhaPrimeiroAcessoForm.get('senhaAtual')!;
  }

  public get novaSenha() {
    return this.alterarSenhaPrimeiroAcessoForm.get('novaSenha')!;
  }

  public get confirmacaoNovaSenha() {
    return this.alterarSenhaPrimeiroAcessoForm.get('confirmacaoNovaSenha')!;
  }

}
