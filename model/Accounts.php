<?php
/**
 * Created by PhpStorm.
 * User: User
 * Date: 16.4.2018 г.
 * Time: 0:01
 */

class Accounts extends User
{


    protected $acc_name;
    protected $expenses;
    protected $incomes;

    public function Acc($name, $expense, $income)
    {
        $this->expenses = $expense;
        $this->incomes = $income;
        $this->acc_name = $name;

    }

    public function getTotal($id)
    {
        $statement = $this->pdo->prepare("SELECT 
                                              income, expense
                                                    FROM
                                                  (SELECT 
                                                        account_id as income_acc_id,SUM(amount) AS income
                                                     FROM
                                                        transactions AS i
                                                       WHERE
                                                         i.type_id = 1) AS t
                                                      JOIN
                                                           (SELECT 
                                                                    account_id as expense_acc_id,SUM(amount) AS expense
                                                                FROM
                                                                    transactions AS e
                                                                WHERE
                                                                    e.type_id = 2) AS e
                                                                    JOIN
                                                                accounts AS a
                                                                ON (a.id=expense_acc_id) AND a.id=income_acc_id
                                                            WHERE
                                                                a.user_id = ?
                                                            GROUP BY user_id");
        $statement->execute([$id]);
        $row=$statement->fetch(PDO::FETCH_ASSOC);
        return $row;


    }

    public function getAccountsInfo($id)
    {
        $result = [];
        $statement = $this->pdo->prepare("SELECT 
    a.id, a.name, a.user_id, income, expense
FROM
    accounts AS a
        LEFT JOIN
    (SELECT 
        account_id AS acc_id, SUM(amount) AS income
    FROM
        transactions AS i
    WHERE
        type_id = 1
    GROUP BY account_id) AS t ON a.id = acc_id
        LEFT JOIN
    (SELECT 
        account_id AS expense_acc_id, SUM(amount) AS expense
    FROM
        transactions AS e
    WHERE
        type_id = 2
    GROUP BY account_id) AS te ON a.id = expense_acc_id
    HAVING a.user_id=?");
        $statement->execute([$id]);
        while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
            $result[] = $row;
        }
        return $result;
    }


    public function getMaxIncomeFromAllAccounts($id){
        $statement=$this->pdo->prepare("SELECT 
                                                MAX(income) as income, a.name,acc_id
                                                FROM
                                                    (SELECT 
                                                        account_id AS acc_id, MAX(amount) AS income
                                                    FROM
                                                        transactions AS t
                                                    WHERE
                                                        type_id = 1
                                                    GROUP BY account_id) AS e
                                                        RIGHT JOIN
                                                    accounts AS a ON (a.id = acc_id)
                                                WHERE
                                                    a.user_id = ?
                                                GROUP BY a.name
                                                ORDER BY income DESC
                                                LIMIT 1");
        $statement->execute([$id]);
        $row=$statement->fetch(PDO::FETCH_ASSOC);
        return $row;
    }

    public function getMinIncomeFromAllAccounts($id){
                                        $statement=$this->pdo->prepare("SELECT 
                                         MAX(expense) AS expense, a.name, acc_id
                                         FROM
                                         (SELECT 
                                            account_id AS acc_id, MAX(amount) AS expense
                                          FROM
                                             transactions AS t
                                          WHERE
                                            type_id = 2
                                          GROUP BY account_id) AS e
                                           RIGHT JOIN
                                             accounts AS a ON (a.id = acc_id)
                                           WHERE
                                             a.user_id = ?
                                           GROUP BY a.name
                                           ORDER BY expense DESC
                                            LIMIT 1");
        $statement->execute([$id]);
        $row=$statement->fetch(PDO::FETCH_ASSOC);
        return $row;
    }

    function getAccNamesAndAccIds($user_id){
        $result=[];
        $statement=$this->pdo->prepare("SELECT name, id FROM accounts WHERE user_id=?");
        $statement->execute([$user_id]);
        while($row=$statement->fetch(PDO::FETCH_ASSOC)){
            $result[]=$row;
        }
        return $result;

    }

    function checkIfAccountExistsAndInsert($name,$amount,$id)
    {
        $numberAcc = $this->pdo->prepare("SELECT count(*) as count FROM accounts WHERE user_id=?");
        $numberAcc->execute([$id]);
        $result = $numberAcc->fetch(PDO::FETCH_ASSOC);
        if ($result["count"] <= 4) {
            $statement = $this->pdo->prepare("SELECT count(*) as count FROM accounts WHERE name=? AND user_id=?");
            $statement->execute([$name, $id]);
            $row = $statement->fetch(PDO::FETCH_ASSOC);
            if ($row["count"] == 0) {
                try {
                    $trans = $this->pdo->beginTransaction();
                    $insert = $this->pdo->prepare("INSERT INTO accounts(user_id,name) VALUES (?,?)");
                    $insert->execute([$id, $name]);
                    //Using ---LAST_INSERT_ID()--- we get last inserted ID in DB!;
                    $insertTrans = $this->pdo->prepare("INSERT INTO transactions(account_id,amount,category_id,date,type_id)
                                                           VALUES (LAST_INSERT_ID(),?,1,now(),1)");
                    $insertTrans->execute([$amount]);
                    $trans = $this->pdo->commit();
                    return true;
                } catch (PDOException $e) {
                    $trans = $this->pdo->rollBack();
                    return false;
                }
            }
            return false;
        }
        return false;
    }

    function getTransactionType(){
        $result=[];
        $statement=$this->pdo->prepare("SELECT id,name FROM type_transactions");
        $statement->execute();
       while($row=$statement->fetch(PDO::FETCH_ASSOC)){
           $result[]=$row;
       }
       return $result;
    }

    function getCategoryList($id){
        $result=[];
        $statement=$this->pdo->prepare("SELECT c.id,c.name,i.img_url FROM categories as c
                                                JOIN icons as i
                                                ON (i.id=c.image_id)
                                                WHERE c.user_id=0 OR c.user_id=?");
        $statement->execute([$id]);
        while($row=$statement->fetch(PDO::FETCH_ASSOC)){
            $result[]=$row;
        }
        return $result;
    }

    function getIconList(){
        $result=[];
        $statement=$this->pdo->prepare("SELECT id,img_url FROM icons");
        $statement->execute();
        while($row=$statement->fetch(PDO::FETCH_ASSOC)){
            $result[]=$row;
        }
        return $result;
    }

    /**
     * @return mixed
     */
    public function getAccName()
    {
        return $this->acc_name;
    }

    /**
     * @param mixed $acc_name
     */
    public function setAccName($acc_name)
    {
        $this->acc_name = $acc_name;
    }

    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->user_id;
    }

    /**
     * @param mixed $user_id
     */
    public function setUserId($user_id)
    {
        $this->user_id = $user_id;
    }


}