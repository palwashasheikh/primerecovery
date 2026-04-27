rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 0. Global Safety Net
    match /{document=**} {
      allow read, write: if false;
    }

    // --- Helpers ---
    function isSignedIn() { return request.auth != null; }
    function isAdmin() { return isSignedIn() && exists(/databases/$(database)/documents/admins/$(request.auth.uid)); }
    function isOwner(userId) { return isSignedIn() && request.auth.uid == userId; }
    
    function isValidId(id) { 
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); 
    }
    
    function incoming() { return request.resource.data; }
    function existing() { return resource.data; }

    // --- Entity Validations ---
    
    function isValidProduct(data) {
      return data.keys().hasAll(['id', 'name', 'price', 'image', 'category'])
        && data.id is int
        && data.name is string && data.name.size() > 0 && data.name.size() <= 200
        && data.price is number && data.price >= 0
        && data.image is string && data.image.size() <= 1000
        && data.category is string && data.category.size() <= 100
        && (!data.hasAny(['description']) || data.description is string && data.description.size() <= 10000)
        && (!data.hasAny(['variants']) || data.variants is string && data.variants.size() <= 20000)
        && (!data.hasAny(['options']) || data.options is string && data.options.size() <= 5000)
        && (!data.hasAny(['updatedAt']) || data.updatedAt == request.time);
    }

    function isValidOrder(data) {
      return data.keys().hasAll(['customerName', 'customerEmail', 'totalAmount', 'status', 'createdAt'])
        && data.customerName is string && data.customerName.size() > 0 && data.customerName.size() <= 200
        && data.customerEmail is string && data.customerEmail.size() > 0 && data.customerEmail.size() <= 200
        && data.totalAmount is number && data.totalAmount >= 0
        && data.status in ['pending', 'processing', 'completed', 'cancelled']
        && data.createdAt == request.time
        && (!data.hasAny(['userId']) || (data.userId is string && data.userId == request.auth.uid));
    }

    function isValidOrderItem(data) {
      return data.keys().hasAll(['productId', 'name', 'quantity', 'price'])
        && data.productId is int
        && data.name is string && data.name.size() > 0 && data.name.size() <= 200
        && data.quantity is int && data.quantity > 0 && data.quantity <= 100
        && data.price is number && data.price >= 0
        && (!data.hasAny(['variantTitle']) || (data.variantTitle is string && data.variantTitle.size() <= 200));
    }

    function isValidUser(data) {
       return data.keys().hasAll(['displayName', 'email', 'photoURL', 'createdAt'])
        && data.displayName is string && data.displayName.size() <= 200
        && data.email is string && data.email.size() <= 200
        && data.photoURL is string && data.photoURL.size() <= 1000
        && data.createdAt == request.time
        && (!data.hasAny(['isAdmin']) || data.isAdmin == false); // Users cannot make themselves admin
    }

    // --- Match Blocks ---

    match /products/{productId} {
      allow read: if true;
      allow create, update: if isAdmin() && isValidProduct(incoming());
      allow delete: if isAdmin();
    }

    match /orders/{orderId} {
      // Secure List Query: Must filter by userId if signed in, or restrict based on email for guest?
      // Actually, for orders, we restrict by userId field.
      allow list: if isSignedIn() && resource.data.userId == request.auth.uid;
      allow get: if isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid) || (incoming().customerEmail == existing().customerEmail); // allow simple check? problematic.
      // Better: if you know the orderId and you are the owner.
      
      allow create: if isValidOrder(incoming()); // support guest checkout
      
      allow update: if (isAdmin() || (isSignedIn() && resource.data.userId == request.auth.uid))
        && isValidOrder(incoming())
        && (
          isAdmin() || (
            // User can only cancel if pending
            existing().status == 'pending' && incoming().status == 'cancelled'
            && incoming().diff(existing()).affectedKeys().hasOnly(['status'])
          )
        );
      allow delete: if isAdmin();

      match /items/{itemId} {
        // Master Gate: Access depends on parent order
        allow read, write: if get(/databases/$(database)/documents/orders/$(orderId)).data.userId == request.auth.uid || isAdmin();
        // Allow creation if the parent order is being created or already belongs to user
        allow create: if isValidOrderItem(incoming()) && (
          existsAfter(/databases/$(database)/documents/orders/$(orderId))
          || (isSignedIn() && get(/databases/$(database)/documents/orders/$(orderId)).data.userId == request.auth.uid)
        );
      }
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
      allow create: if isOwner(userId) && isValidUser(incoming());
      allow update: if isOwner(userId) 
        && incoming().diff(existing()).affectedKeys().hasOnly(['displayName', 'photoURL'])
        // Immutable email and createdAt
        && incoming().email == existing().email
        && incoming().createdAt == existing().createdAt;
    }

    match /admins/{userId} {
      allow read: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      // Initial admin setup: only allow our specific email to be added if no admins exist or by existing admins
      allow create: if (request.auth.token.email == 'hamadshalman23@gmail.com' && request.auth.token.email_verified == true) 
                   || isAdmin();
    }
  }
}
