/**
 * All Email that  will be send
 */
export const enum EmailKey {
    accounActivate,
    accounCanceled,
    accounReactivated,
    accounValidation,
    welcomeThanks,
    welcome,
    invitationBrand,
    feedbackApproved,
    feedbackApproved2,
    invitationMeeting,
    newBriefFill,
    newComment,
    invitationAccepted,
    invitationCustomerGuests,
    invitationTeamMember,
    invitationCore,
    restorePasswordRequest,
    restorePasswordSuccess,
    restorePassword,
}
export interface EmailTemplate {
    path: string;
    template: string;
    emailKey: EmailKey;
}

/**
 * All templates should be here,
 * @code EmailKey is equal to a number
 */
export const EMAIL_TEMPLATES:  EmailTemplate[] = [
    { path: 'account', template: 'account-activate.html', emailKey: EmailKey.accounActivate},
    { path: 'account', template: 'account-canceled.html', emailKey: EmailKey.accounCanceled},
    { path: 'account', template: 'account-reactivate.html', emailKey: EmailKey.accounReactivated},
    { path: 'account', template: 'account-validation.html', emailKey: EmailKey.accounValidation},
    { path: 'account', template: 'welcome-thanks.html', emailKey: EmailKey.welcomeThanks},
    { path: 'account', template: 'welcome.html', emailKey: EmailKey.welcome},

    { path: 'brand', template: 'invitation-brand.html', emailKey: EmailKey.invitationBrand },
    { path: 'core', template: 'feedback-approved.html', emailKey: EmailKey.feedbackApproved },
    { path: 'core', template: 'feedback-approved2.html', emailKey: EmailKey.feedbackApproved2 },
    { path: 'core', template: 'invitation-meeting.html', emailKey: EmailKey.invitationMeeting },
    { path: 'core', template: 'new-brief-fill.html', emailKey: EmailKey.newBriefFill },
    { path: 'core', template: 'new-comment.html', emailKey: EmailKey.newComment },

    { path: 'invitations', template: 'invitation-accepted.html', emailKey: EmailKey.invitationAccepted },
    { path: 'invitations', template: 'invitation-customers-guests.html', emailKey: EmailKey.invitationCustomerGuests },
    { path: 'invitations', template: 'invitation-core-new-user.html', emailKey: EmailKey.invitationTeamMember },
    {path:  'invitations', template: 'invitation-core.html', emailKey: EmailKey.invitationCore},

    { path: 'password', template: 'restore-password-request.html', emailKey: EmailKey.restorePasswordRequest },
    { path: 'password', template: 'restore-password-success.html', emailKey: EmailKey.restorePasswordSuccess },
    { path: 'password', template: 'restore-password.html', emailKey: EmailKey.restorePassword }

];


export class EmailBuilder {
    public static getPath(emailKey: string): string {
        const emailTemplate = EMAIL_TEMPLATES.filter( x => x.emailKey.toString() === emailKey )[0];
        return  emailTemplate.path + '/' + emailTemplate.template;
    }
}
