"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[582],{1582:(it,h,s)=>{s.r(h),s.d(h,{UserModule:()=>tt});var m=s(6895),u=s(9938),Z=s(9302),a=s(4006),f=s(7368),A=s(8372),F=s(5e3),t=s(4650),U=s(8606),_=s(3263),T=s(2510),x=s(5412),v=s(9549),I=s(4144),C=s(4859),y=s(3683);function D(i,r){1&i&&(t.TgZ(0,"mat-label"),t._uU(1,"Name"),t.qZA())}function N(i,r){if(1&i&&(t.TgZ(0,"mat-form-field"),t._UZ(1,"input",15),t.qZA()),2&i){const e=t.oxw();t.xp6(1),t.Q6J("value",null==e.userDetails?null:e.userDetails.fullName)}}function J(i,r){1&i&&(t.TgZ(0,"mat-label"),t._uU(1,"Role"),t.qZA())}function M(i,r){if(1&i&&(t.TgZ(0,"mat-form-field"),t._UZ(1,"input",15),t.qZA()),2&i){const e=t.oxw();t.xp6(1),t.Q6J("value",null==e.userDetails?null:e.userDetails.role)}}function Y(i,r){1&i&&(t.TgZ(0,"mat-error"),t._uU(1,"Required "),t.qZA())}function L(i,r){1&i&&(t.TgZ(0,"mat-error"),t._uU(1," Email already exists. "),t.qZA())}function O(i,r){1&i&&(t.TgZ(0,"mat-error"),t._uU(1," Invalid Email. "),t.qZA())}function S(i,r){1&i&&t._UZ(0,"span",22)}function q(i,r){1&i&&(t.TgZ(0,"span",23),t._uU(1,"Loading..."),t.qZA())}function w(i,r){if(1&i&&(t.TgZ(0,"span"),t._uU(1),t.qZA()),2&i){const e=t.oxw(3);t.xp6(1),t.hij(" ",null!=e.userDetails&&e.userDetails._id?"Reinvite":"Invite","")}}function Q(i,r){if(1&i){const e=t.EpF();t.TgZ(0,"button",19),t.NdJ("click",function(){t.CHM(e);const o=t.oxw(2);return t.KtG(o.inviteUser())}),t.YNc(1,S,1,0,"span",20),t.YNc(2,q,2,0,"span",21),t.YNc(3,w,2,1,"span",11),t.qZA()}if(2&i){const e=t.oxw(2);t.Q6J("disabled",e.inviteUserForm.invalid||e.apiCallActive),t.xp6(1),t.Q6J("ngIf",e.apiCallActive),t.xp6(1),t.Q6J("ngIf",e.apiCallActive),t.xp6(1),t.Q6J("ngIf",!e.apiCallActive)}}function E(i,r){if(1&i&&(t.TgZ(0,"mat-toolbar",16)(1,"div",17),t.YNc(2,Q,4,4,"button",18),t.qZA()()),2&i){const e=t.oxw();t.xp6(2),t.Q6J("ngIf",!e.userDetails.isSignedUp)}}let P=(()=>{class i{constructor(e,n,o,l,c,d,et){this.matDialog=e,this.data=n,this.apiService=o,this.errorHandlingService=l,this.matcher=c,this.fb=d,this.alertService=et,this.userDetails={},this.apiCallActive=!1,this.isViewOnly=!1,this.userDetails=n.user,this.inviteUserForm=this.fb.group({email:[n?.user?.email||"",[a.kI.required,a.kI.pattern(F.c.emailValidator.pattern)]]}),this.inviteUserForm.controls.email.valueChanges.pipe((0,A.b)(500)).subscribe({next:nt=>{this.checkEmailUniqueness()}})}ngOnInit(){}inviteUser(){if(this.inviteUserForm.valid){this.apiCallActive=!0;let e={email:this.inviteUserForm.value.email},n=u.d.inviteUser;!this.userDetails?.isSignedUp&&this.userDetails?._id&&(n=u.d.reinviteUser,e._id=this.userDetails?._id),this.apiService.post(n,e).subscribe({next:o=>{this.alertService.notify(o.message),this.matDialog.close(o)},error:o=>{this.errorHandlingService.handle(o)},complete:()=>{this.apiCallActive=!1}})}}checkEmailUniqueness(){let e=this.inviteUserForm.controls.email;e.valid&&e.value.trim()&&e.value.trim()!=this.userDetails?.email&&(this.apiCallActive=!0,this.apiService.get(u.d.checkEmailUniqueness+e.value.trim().toLowerCase()).subscribe({next:n=>{this.apiCallActive=!1,!1===n.isUnique?e.setErrors({not_unique:!0}):this.inviteUserForm.controls.email.errors&&delete this.inviteUserForm.controls.email.errors.not_unique},error:n=>{this.apiCallActive=!1,this.errorHandlingService.handle(n)}}))}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(f.so),t.Y36(f.WI),t.Y36(U.a),t.Y36(_.r),t.Y36(T.d),t.Y36(a.qu),t.Y36(x.c))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-invite-user-form"]],decls:25,vars:14,consts:[["fxLayout","column",1,"container-div"],["fxLayoutAlign","end flex-end",1,"mat-accent-bg","m-0"],["fxFlex","100","fxLayout","row","fxLayoutAlign","space-between flex-end",1,"mat-toolbar-header"],[1,"title","dialog-title"],[1,"mat-button-wrapper","cursor-pointer",3,"click"],["width","24","height","24","viewBox","0 0 24 24","fill","none","xmlns","http://www.w3.org/2000/svg"],["cx","12","cy","12","r","10","stroke","#8F8F8F","stroke-width","1.5"],["d","M14.5 9.49999L9.5 14.5M9.49998 9.49997L14.5 14.4999","stroke","#8F8F8F","stroke-width","1.5","stroke-linecap","round"],["fxLayout","column",1,"content","mt-15"],["fx-layout","column",3,"formGroup"],["fxLayout","column","fxLayout.gt-xs","row"],[4,"ngIf"],["fxFlex","100"],["type","text","matInput","","formControlName","email","trim","","autocomplete","off",3,"errorStateMatcher","readonly"],["class","mat-accent-bg m-0","fxLayoutAlign","center",4,"ngIf"],["type","text","matInput","","readonly","",3,"value"],["fxLayoutAlign","center",1,"mat-accent-bg","m-0"],["fxlayout","row","fxLayoutAlign","flex-end","fxFlex","100",1,"mat-toolbar-footer","action-buttons"],["mat-raised-button","","color","primary","type","submit",3,"disabled","click",4,"ngIf"],["mat-raised-button","","color","primary","type","submit",3,"disabled","click"],["class","spinner-border spinner-border-sm","role","status","aria-hidden","true",4,"ngIf"],["class","sr-only",4,"ngIf"],["role","status","aria-hidden","true",1,"spinner-border","spinner-border-sm"],[1,"sr-only"]],template:function(e,n){1&e&&(t.TgZ(0,"div",0)(1,"mat-toolbar",1)(2,"div",2)(3,"span",3),t._uU(4),t.qZA(),t.TgZ(5,"span",4),t.NdJ("click",function(){return n.matDialog.close()}),t.O4$(),t.TgZ(6,"svg",5),t._UZ(7,"circle",6)(8,"path",7),t.qZA()()()(),t.kcU(),t.TgZ(9,"div",8)(10,"form",9)(11,"div",10),t.YNc(12,D,2,0,"mat-label",11),t.YNc(13,N,2,1,"mat-form-field",11),t.YNc(14,J,2,0,"mat-label",11),t.YNc(15,M,2,1,"mat-form-field",11),t.TgZ(16,"div",10)(17,"mat-label"),t._uU(18,"Email "),t.qZA(),t.TgZ(19,"mat-form-field",12),t._UZ(20,"input",13),t.YNc(21,Y,2,0,"mat-error",11),t.YNc(22,L,2,0,"mat-error",11),t.YNc(23,O,2,0,"mat-error",11),t.qZA()()()()(),t.YNc(24,E,3,1,"mat-toolbar",14),t.qZA()),2&e&&(t.xp6(4),t.Oqu(null!=n.userDetails&&n.userDetails.isSignedUp?"User Details":null!=n.userDetails&&n.userDetails._id?"Reinvite User":"Invite User"),t.xp6(6),t.Q6J("formGroup",n.inviteUserForm),t.xp6(2),t.Q6J("ngIf",n.userDetails.fullName),t.xp6(1),t.Q6J("ngIf",n.userDetails.fullName),t.xp6(1),t.Q6J("ngIf",n.userDetails.role),t.xp6(1),t.Q6J("ngIf",n.userDetails.role),t.xp6(4),t.ekj("mb-10",n.inviteUserForm.controls.email.touched&&n.inviteUserForm.controls.email.hasError("required")),t.xp6(1),t.Q6J("errorStateMatcher",n.matcher)("readonly",null==n.userDetails?null:n.userDetails.isSignedUp),t.xp6(1),t.Q6J("ngIf",n.inviteUserForm.controls.email.hasError("required")),t.xp6(1),t.Q6J("ngIf",!n.inviteUserForm.controls.email.hasError("required")&&!n.inviteUserForm.controls.email.hasError("pattern")&&n.inviteUserForm.controls.email.hasError("not_unique")),t.xp6(1),t.Q6J("ngIf",!n.inviteUserForm.controls.email.hasError("required")&&n.inviteUserForm.controls.email.hasError("pattern")),t.xp6(1),t.Q6J("ngIf",!n.isViewOnly))},dependencies:[m.O5,v.TO,v.KE,v.hX,I.Nt,C.lW,y.Ye,a._Y,a.Fj,a.JJ,a.JL,a.sg,a.u]}),i})();var b=s(8996),p=s(3546),k=s(4850),R=s(7392),g=s(8255);function H(i,r){1&i&&(t.TgZ(0,"p",10),t._uU(1," There is no User created yet!\n"),t.qZA())}function $(i,r){1&i&&(t.TgZ(0,"button",22),t._uU(1,"Active"),t.qZA())}function j(i,r){1&i&&(t.TgZ(0,"button",23),t._uU(1,"Deactivated"),t.qZA())}function B(i,r){1&i&&(t.TgZ(0,"button",24),t._uU(1,"Invitation sent"),t.qZA())}function V(i,r){if(1&i){const e=t.EpF();t.TgZ(0,"button",20),t.NdJ("click",function(){t.CHM(e);const o=t.oxw(),l=o.index,c=o.$implicit,d=t.oxw();return t.KtG(d.openConfirmDialog(l,c))}),t._uU(1),t.qZA()}if(2&i){const e=t.oxw().$implicit;t.xp6(1),t.Oqu((e.isActive?"Deactivate":"Activate")+" user")}}function G(i,r){if(1&i){const e=t.EpF();t.TgZ(0,"mat-card",11)(1,"mat-card-header")(2,"mat-card-title"),t._uU(3),t.ALo(4,"titlecase"),t.qZA(),t.TgZ(5,"mat-card-subtitle"),t._uU(6),t.qZA()(),t.TgZ(7,"mat-card-actions"),t.YNc(8,$,2,0,"button",12),t.YNc(9,j,2,0,"button",13),t.YNc(10,B,2,0,"button",14),t.TgZ(11,"a",15),t.O4$(),t.TgZ(12,"svg",16),t._UZ(13,"rect",17)(14,"path",18),t.qZA()(),t.kcU(),t.TgZ(15,"mat-menu",null,19)(17,"button",20),t.NdJ("click",function(){const l=t.CHM(e).$implicit,c=t.oxw();return t.KtG(c.openUserInviteForm(!0,l))}),t._uU(18),t.qZA(),t.YNc(19,V,2,1,"button",21),t.qZA()()()}if(2&i){const e=r.$implicit,n=t.MAs(16);t.xp6(3),t.Oqu(t.lcZ(4,8,null!=e&&e.firstName?(null==e?null:e.firstName)+" "+(null==e?null:e.lastName):null==e?null:e.fullName)),t.xp6(3),t.hij("",e.email," "),t.xp6(2),t.Q6J("ngIf",e.isActive&&e.isSignedUp),t.xp6(1),t.Q6J("ngIf",!e.isActive&&e.isSignedUp),t.xp6(1),t.Q6J("ngIf",e.isActive&&!e.isSignedUp),t.xp6(1),t.Q6J("matMenuTriggerFor",n),t.xp6(7),t.Oqu(e.isActive&&!e.isSignedUp?"Reinvite":"View"),t.xp6(1),t.Q6J("ngIf",e.isSignedUp)}}let K=(()=>{class i{constructor(e,n,o,l,c){this.apiService=e,this.dialog=n,this.errorHandlingService=o,this.alertService=l,this.activeRoute=c,this.users=[],this.apiCallActive=!0,this.displayedColumns=["id","fullName","email","isSignedUp","action"],this.activeRoute.params.subscribe({next:d=>{this.getUsers()}})}ngOnInit(){}openConfirmDialog(e,n){this.addUserDialogRef=this.dialog.open(Z.$,{minWidth:"320px",width:"585px",disableClose:!0,data:{user:n,heading:(n.isActive?"Deactivate":"Activate")+" User",message:"Are you sure you want to "+(n.isActive?"de":"")+"activate this user?"}}),this.addUserDialogRef.afterClosed().subscribe({next:o=>{o&&this.manageUser(e,n)}})}openUserInviteForm(e,n={}){this.addUserDialogRef=this.dialog.open(P,{minWidth:"320px",width:"585px",disableClose:!0,data:{isViewOnly:e,user:n}}),this.addUserDialogRef.afterClosed().subscribe({next:o=>{o&&this.getUsers()}})}getUsers(){this.apiCallActive=!0,this.apiService.get(u.d.user).subscribe({next:e=>{this.apiCallActive=!1,this.users=e.users||[]},error:e=>{this.apiCallActive=!1,this.errorHandlingService.handle(e)}})}manageUser(e,n){this.apiService.put(u.d.manageUserAccess,{email:n.email,isActive:!n.isActive}).subscribe({next:o=>{this.users[e].isActive=!this.users[e].isActive,this.alertService.notify(o.message)},error:o=>this.errorHandlingService.handle(o)})}}return i.\u0275fac=function(e){return new(e||i)(t.Y36(U.a),t.Y36(f.uw),t.Y36(_.r),t.Y36(x.c),t.Y36(b.gz))},i.\u0275cmp=t.Xpm({type:i,selectors:[["app-user-list"]],decls:15,vars:3,consts:[[1,"title-group"],[1,"title"],[1,"h1"],[1,"line","italic"],[1,"title-buttons"],["mat-raised-button","","color","primary",3,"click"],["fxFlex","1 0",1,""],["class","no-data",4,"ngIf"],[1,"flex","flex-row","space-between","gap","mt-10"],["class","example-card ",4,"ngFor","ngForOf"],[1,"no-data"],[1,"example-card"],["class","active-chip",4,"ngIf"],["class","deactivated-chip",4,"ngIf"],["class","disabled-chip",4,"ngIf"],[1,"cursor-pointer",3,"matMenuTriggerFor"],["width","40","height","40","viewBox","0 0 40 40","fill","none","xmlns","http://www.w3.org/2000/svg"],["x","39.5","y","0.5","width","39","height","39","rx","19.5","transform","rotate(90 39.5 0.5)","fill","white","stroke","#F3F3F3"],["fill-rule","evenodd","clip-rule","evenodd","d","M20 10C21.1046 10 22 10.8954 22 12C22 13.1046 21.1046 14 20 14C18.8954 14 18 13.1046 18 12C18 10.8954 18.8954 10 20 10ZM20 18C21.1046 18 22 18.8954 22 20C22 21.1046 21.1046 22 20 22C18.8954 22 18 21.1046 18 20C18 18.8954 18.8954 18 20 18ZM22 28C22 26.8954 21.1046 26 20 26C18.8954 26 18 26.8954 18 28C18 29.1046 18.8954 30 20 30C21.1046 30 22 29.1046 22 28Z","fill","#BFBFBF"],["menu","matMenu"],["mat-menu-item","",3,"click"],["mat-menu-item","",3,"click",4,"ngIf"],[1,"active-chip"],[1,"deactivated-chip"],[1,"disabled-chip"]],template:function(e,n){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"h1",2),t._uU(3," User List "),t.TgZ(4,"p",3),t._uU(5),t.qZA()()(),t.TgZ(6,"div",4)(7,"button",5),t.NdJ("click",function(){return n.openUserInviteForm(!1)}),t.TgZ(8,"mat-icon"),t._uU(9,"add"),t.qZA(),t._uU(10," Invite User "),t.qZA()()(),t._UZ(11,"mat-divider",6),t.YNc(12,H,2,0,"p",7),t.TgZ(13,"div",8),t.YNc(14,G,20,10,"mat-card",9),t.qZA()),2&e&&(t.xp6(5),t.hij("",n.users.length," users"),t.xp6(7),t.Q6J("ngIf",!n.apiCallActive&&(null==n.users?null:n.users.length)<=0),t.xp6(2),t.Q6J("ngForOf",n.users))},dependencies:[m.sg,m.O5,p.a8,p.dk,p.n5,p.$j,p.hq,C.lW,k.d,R.Hw,g.VK,g.OP,g.p6,m.rS],styles:["table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:first-child, table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:first-child{width:50px;word-break:break-all}table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child, table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child{width:100px;align-content:flex-end}table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]:last-child   .mat-icon-button[_ngcontent-%COMP%], table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]:last-child   .mat-icon-button[_ngcontent-%COMP%]{width:25px}"]}),i})();var W=s(4111),z=s(5718);const X=[{path:"list",component:K},{path:"**",redirectTo:"list"}];let tt=(()=>{class i{}return i.\u0275fac=function(e){return new(e||i)},i.\u0275mod=t.oAB({type:i}),i.\u0275inj=t.cJS({imports:[b.Bz.forChild(X),m.ez,z.q,W.q]}),i})()}}]);