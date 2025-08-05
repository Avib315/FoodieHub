
 const ApiMessages = {
  errorMessages: {
    invalidData: "המידע שהוכנס לא תקין",
    unauthorized: "אין הרשאה לבצע פעולה זו",
    forbidden: "הגישה אסורה",
    notFound: "הנתון המבוקש לא נמצא",
    serverError: "שגיאה פנימית בשרת",
    badRequest: "בקשה לא תקינה",
    conflict: "קונפליקט במידע",
    missingRequiredFields: "חסרים שדות נדרשים",
    creationFailed: "יצירת הנתון נכשלה",
    updateFailed: "עדכון הנתון נכשל",
    deletionFailed: "מחיקת הנתון נכשלה",
    imageUploadFailed: "העלאת התמונה נכשלה",
    invalidCredentials: "פרטי התחברות שגויים",
    tokenExpired: "פג תוקף ההתחברות",
    tokenInvalid: "טוקן לא תקין",
    
    userNotFound: "המשתמש לא נמצא",
    userAlreadyExists: "המשתמש כבר קיים במערכת",
    emailAlreadyExists: "כתובת המייל כבר קיימת במערכת",
    
    requiredField: "שדה חובה",
    invalidEmail: "כתובת מייל לא תקינה",
    invalidPhone: "מספר טלפון לא תקין",
    passwordTooWeak: "הסיסמה חלשה מדי",
    
    invalidFileType: "סוג קובץ לא נתמך",
    uploadFailed: "העלאת הקובץ נכשלה"
  },
  
  successMessages: {
    createUser: "היוזר נוצר בהצלחה",
    updateUser: "פרטי המשתמש עודכנו בהצלחה",
    deleteUser: "המשתמש נמחק בהצלחה",
    userLogin: "התחברות בוצעה בהצלחה",
    userLogout: "התנתקות בוצעה בהצלחה",
    
    dataCreated: "הנתונים נוצרו בהצלחה",
    dataUpdated: "הנתונים עודכנו בהצלחה",
    dataDeleted: "הנתונים נמחקו בהצלחה",
    dataSaved: "הנתונים נשמרו בהצלחה",
    
    fileUploaded: "הקובץ הועלה בהצלחה",
    fileDeleted: "הקובץ נמחק בהצלחה",
    
    emailSent: "המייל נשלח בהצלחה",
    passwordReset: "הסיסמה אופסה בהצלחה"
  }
};
module.exports =  ApiMessages ;   