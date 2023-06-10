import { Component, ErrorHandler } from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {IRouteHistory, RouterHistoryService} from 'src/app/service/router-history.service';
import {ConfigFile, ConfigFileType} from 'src/app/service/server/api';
import {ServerService} from 'src/app/service/server/server.service';

declare var monaco: any;

@Component({
  selector: 'app-edit-config',
  templateUrl: './edit-config.component.html',
  styleUrls: ['./edit-config.component.scss']
})
export class EditConfigComponent {
  private preRoute: IRouteHistory | undefined;
  validateForm!: UntypedFormGroup;
  editorOptions = {theme: 'vs-light', language: 'yaml'};
  code = ''
  originFile: string;
  name = ''

  hasDiff() {
    return JSON.stringify({type: this.validateForm.value.type, context: this.code}) !== this.originFile;
  }

  constructor(
    private fb: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private routeHistory: RouterHistoryService,
    private server: ServerService,
    private errorHandler: ErrorHandler,
  ) {
    this.activatedRoute.data.subscribe({
      next: (d: unknown) => {
        console.log(d);
        const data = d as {file: ConfigFile};
        const file = data.file as ConfigFile;
        this.code = file.context;
        this.originFile = JSON.stringify({type: file.type, context: file.context});
        this.name = file.name;

        switch(file.type) {
          case ConfigFileType.JSON:
            this.editorOptions.language = 'json';
            break;
          case ConfigFileType.YAML:
            this.editorOptions.language = 'yaml';
            break;
          case ConfigFileType.RAW:
        }

        this.validateForm = this.fb.group({
          name: [file.name, Validators.required],
          context: [file.context],
          type: [file.type]
        });
      }
    });
  }

  ngOnInit(): void {
    this.preRoute = this.routeHistory.getPrevious('/business/config/edit');
  }

  goBack() {
    this.routeHistory.back(this.preRoute, '/business/config/config-list');
  }

  onEditorInit(editor: any) {
    this.validateForm.valueChanges.subscribe((value) => {
      const model = editor.getModel();
      if (!model)
        return;
      switch(value.type) {
        case ConfigFileType.JSON:
          monaco.editor.setModelLanguage(model, 'json');
          break;
        case ConfigFileType.YAML:
          monaco.editor.setModelLanguage(model, 'yaml');
          break;
        case ConfigFileType.RAW:
          break;
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      this.save();
    });
  }

  save() {
    if (!this.hasDiff())
      return;

    const code = this.code;
    const type = this.validateForm.value.type;
    const name = this.validateForm.value.name;
    this.server.restful.update({
      db: 'config-file',
      data: {
        name,
        context: code,
        type,
      },
      where: {
        name: this.name,
      }
    }).subscribe({
      next: () => {
        this.originFile = JSON.stringify({type, context: code});
        this.name = name;
      },
      error: (err) => {
        this.errorHandler.handleError(err);
      }
    })
  }
}
