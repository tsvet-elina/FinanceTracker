<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 4/19/2018
 * Time: 5:58 PM
 */

namespace Model\Dao;

use Model\Transactions;

class TransactionsDAO extends DAO
{
    static public function insertTransaction(Transactions $transaction){
        $statement=self::$pdo->prepare("INSERT INTO transactions(account_id,amount,category_id,date,type_id) 
                                                  VALUES (?,?,?,now(),?)");
        $statement->execute([$transaction->getAccId(),
                             $transaction->getAmount(),
                                $transaction->getCategoryId(),
                            $transaction->getTypeId()]);

    }

    static public function insertTransactionAndAddCategory($accountId,$amount,$categoryName,$typeId,$iconId,$user_id){
        $statement=self::$pdo->prepare("SELECT a.id FROM categories as a WHERE a.name=?
                                                                    AND a.user_id=? AND a.user_id>0");
        $statement->execute([$categoryName,$user_id]);
        $row=$statement->fetch(\PDO::FETCH_ASSOC);
        if($row["id"]==null){
            try {
                $trans = self::$pdo->beginTransaction();
                $insertCategory = self::$pdo->prepare("INSERT INTO categories(name,image_id,user_id) VALUES (?,?,?)");
                $insertCategory->execute([$categoryName, $iconId, $user_id]);

                $insertTransaction=self::$pdo->prepare("INSERT INTO transactions( category_id,account_id,amount,
                                                       date,type_id) VALUES ( LAST_INSERT_ID(),?,?,now(),?)");
                $insertTransaction->execute([$accountId,$amount,$typeId]);


                $trans = self::$pdo->commit();
                return true;
            }
            catch(\PDOException $e){
                $trans=self::$pdo->rollBack();
                return false;
            }
        }else{
            $insertTransaction=self::$pdo->prepare("INSERT INTO transactions(account_id,amount,
                                                        category_id,date,type_id) VALUES (?,?,?,now(),?)");
            $insertTransaction->execute([$accountId,$amount,$row["id"],$typeId]);
            return true;
        }
    }

    static public function getFirstDateForUser($user_id,$acc_id){
        $statement=self::$pdo->prepare("SELECT DISTINCT date FROM transactions as t
                                                JOIN accounts as a
                                                ON (t.account_id=a.id)
                                                WHERE a.user_id=? AND a.id=?");
        $statement->execute([$user_id,$acc_id]);
        $result=[];
        while($row=$statement->fetch(\PDO::FETCH_ASSOC)){
            $result[]=$row;
        }
        return $result;
    }

    static public function getDateToList($date,$acc_id,$user_id){
        $statement=self::$pdo->prepare("SELECT DISTINCT t.date FROM transactions as t
                                                    JOIN accounts as a
                                                    ON (t.account_id=a.id)
                                                    WHERE a.user_id=? AND a.id=? AND date>=?");
        $statement->execute([$user_id,$acc_id,$date]);
        $result=[];
        while($row=$statement->fetch(\PDO::FETCH_ASSOC)){
            $result[]=$row;
        }
        return $result;


    }

    static public function getAllTransactions($accId){
        $statement=self::$pdo->prepare("SELECT a.name as AccountName,t.amount,c.name as CategoryName,t.date,t.type_id as Type,t.id as ID FROM transactions as t
                                                    JOIN categories as c 
                                                    ON(t.category_id=c.id)
                                                    JOIN accounts as a
                                                    ON(a.id=t.account_id)
                                                    WHERE a.id=?");
        $statement->execute([$accId]);
        $result=[];
        while($row=$statement->fetch(\PDO::FETCH_ASSOC)){
            $result[]=$row;
        }
        return $result;
    }

    static public function RemoveTrans($transId){
        $statement=self::$pdo->prepare("DELETE FROM transactions WHERE id=?");
        $statement->execute([$transId]);
    }

}