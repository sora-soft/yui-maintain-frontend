import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthName, UserService } from '../../service/user.service'

@Directive({
  selector: '[auth]'
})
export class AuthDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService,
  ) { }

  @Input() set auth(names: AuthName[] | AuthName | undefined) {
    const permission = names ? this.userService.checkPermissions(names) : true;

    if (permission && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!permission && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
