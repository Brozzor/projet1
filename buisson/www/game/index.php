<?php 
   require('db.php');
   if($_GET['pseudo']) {
    $pseudo = htmlspecialchars($_GET['pseudo']);
    $reqpseudo = $pdo->prepare('SELECT count(*) as nb FROM user WHERE pseudo = ?');
    $reqpseudo->execute(array($pseudo));
    $user = $reqpseudo->fetch();

    if ($user['nb'] == 0){
    $insertpseudo = $pdo->prepare('INSERT INTO user SET pseudo = ?');
    $insertpseudo->execute([$pseudo]);
    }
    
 }
?>