import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'mensagem-associacao-imoveis-dialog',
    templateUrl: './mensagem-associacao-imoveis.dialog.component.html',
    standalone: true,
    imports:[
        MatDialogModule
    ]
})
export class MensagemAssociacaoImoveisDialogComponent{

}