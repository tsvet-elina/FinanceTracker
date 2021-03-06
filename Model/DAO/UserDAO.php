<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 4/19/2018
 * Time: 5:46 PM
 */

namespace Model\DAO;

use Model\User;

class UserDAO extends DAO
{

    static function  registerUser(User $user)
    {
        $statement = self::$pdo->prepare("SELECT COUNT(*) as count FROM users WHERE email=? AND password=?");
        $statement->execute([$user->getEmail(),
            $user->getPassword()]);
        $row = $statement->fetch(\PDO::FETCH_ASSOC);
        if ($row["count"] == 0) {
            $register = self::$pdo->prepare("INSERT INTO users(name,family_name,password,email,image_url,age) VALUES
                                                    (?,?,?,?,?,?)");
            $register->execute([$user->getName(),
                $user->getFamily(),
                $user->getPassword(),
                $user->getEmail(),
                $user->getAvatar(),
                $user->getAge()]);
            return true;

        } else {
            return false;
        }
    }

    public static function checkUser($email, $password){
        $statement = self::$pdo->prepare("SELECT id, name, family_name,password, email, image_url, age FROM users 
                                                    WHERE email=? AND password=? ");
        $statement->execute([$email,$password]);
        $row = $statement->fetch(\PDO::FETCH_ASSOC);
        if($row["id"] == null){
            return $row;
        }else {
            $stat = self::$pdo->prepare("INSERT INTO logs (user_id,date) VALUES (?,now())");
            $stat->execute([$row["id"]]);
            return $row;
        }

    }

    static public function getUserInfoForEit($id){
        $statement = self::$pdo->prepare("SELECT id, name, family_name,password, email, image_url, age FROM users 
                                                   WHERE id=? ");
        $statement->execute([$id]);
        $row = $statement->fetch(\PDO::FETCH_ASSOC);
        return $row;
    }

   static public function editUser($name,$family,$password,$email,$image_url,$age,$id){
        $statement=self::$pdo->prepare("UPDATE users SET name=?,family_name=?,password=?,email=?,image_url=?,age=? WHERE id=? ");
        $statement->execute([$name,$family,$password,$email,$image_url,$age,$id]);
    }

    public static function takeInfoUser($user_id){
        $statement = self::$pdo->prepare("SELECT CONCAT(name,\" \",family_name) as name,  image_url FROM users 
                                                   WHERE id=? ");
        $statement->execute([$user_id]);
        $row = $statement->fetch(\PDO::FETCH_ASSOC);
        return $row;
    }

    public static function lastLogin($user_id){
        $statement = self::$pdo->prepare("SELECT date FROM logs WHERE user_id=? ORDER BY date desc;");
        $statement->execute([$user_id]);
        $result = [];
        while($row = $statement->fetch(\PDO::FETCH_ASSOC)){
            $result[] = $row;
        }

        return $result[1];

    }


}