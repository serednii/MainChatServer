module.exports = class UserDto {
    email;
    id;
    isActivated;
    roles;
    isAddedContent;
    isBlocked
    userName;
    lastUserName;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.roles = model.roles;
        this.isAddedContent = model.isAddedContent;
        this.isBlocked = model.isBlocked;
        this.userName = model.userName;
        this.lastUserName = model.lastUserName;

    }
}